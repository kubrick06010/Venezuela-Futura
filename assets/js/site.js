const repoBlob = 'https://github.com/kubrick06010/Venezuela-Futura/blob/main/';
let documents = [];
let relations = [];
let activeDomain = 'Todos';
let readerReturnFocus = null;

const domains = {
  '00-principios':'Principios',
  '01-contexto':'Contexto',
  '02-memoria':'Memoria',
  '03-pensamiento-venezolano':'Pensamiento',
  '04-territorio':'Territorio',
  '05-instituciones':'Instituciones',
  '06-capacidades':'Capacidades',
  '07-diseno-institucional':'Instituciones',
  '08-estado-del-pais':'Estado del país'
};

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
}[char]));

const domainOf = doc => {
  const root = doc.path.split('/')[0];
  return domains[root] || (doc.type === 'persona' ? 'Personas' : 'Corpus');
};

async function loadData(){
  const [docsRes, relRes] = await Promise.all([
    fetch('site-data/content.json',{cache:'no-store'}),
    fetch('site-data/relations.json',{cache:'no-store'})
  ]);
  if(!docsRes.ok) throw new Error('No se pudo cargar el índice del corpus');
  documents = await docsRes.json();
  relations = relRes.ok ? await relRes.json() : [];
}

function renderStatus(){
  document.getElementById('corpus-status').textContent =
    `${documents.length} documentos · ${relations.length} relaciones`;
}

function renderFlow(){
  const target = document.getElementById('flow-visual');
  const stages = [
    {name:'Memoria',note:'Lo vivido y aprendido',filter:['Memoria','Contexto']},
    {name:'Instituciones',note:'Cómo funcionan',filter:['Instituciones','Principios']},
    {name:'Capacidades',note:'Qué fortalecer',filter:['Capacidades','Territorio']},
    {name:'Futuros',note:'Qué podemos construir',filter:['Pensamiento','Estado del país']}
  ];
  const xs = [12,38,64,88];
  const ys = [34,47,61,75,88];
  const counts = stages.map(stage => documents.filter(doc => stage.filter.includes(domainOf(doc))).length);
  const labels = stages.map((stage,index) =>
    `<div class="flow-stage" style="left:${xs[index]}%"></div>
     <div class="flow-label flow-label-${index}" style="left:${xs[index]}%">
       <strong>${stage.name}</strong><span>${stage.note}</span>
     </div>`).join('');
  const paths = [];
  for(let column=0; column<3; column++){
    ys.forEach((y,index) => {
      const next = ys[(index + column + 1) % ys.length];
      paths.push(`<path class="${index===2?'active':''}" d="M ${xs[column]} ${y-18} C ${xs[column]+12} ${y-18}, ${xs[column+1]-12} ${next-18}, ${xs[column+1]} ${next-18}"/>`);
    });
  }
  const nodes = stages.flatMap((stage,column) => ys.map((y,index) => {
    const size = Math.min(18, 7 + Math.round((counts[column] || 1) / 2) + (index%3)*2);
    return `<i class="flow-node ${column===3&&index===2?'active':''}" style="left:calc(${xs[column]}% - ${size/2}px);top:calc(${y}% - ${size/2}px);width:${size}px;height:${size}px" title="${stage.name}: ${counts[column]} documentos"></i>`;
  })).join('');
  target.innerHTML = `${labels}<svg class="flow-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${paths.join('')}</svg>${nodes}`;
}

function routeDocument(button){
  const exact = documents.find(doc => doc.id === button.dataset.doc);
  if(exact) return exact;
  const number = button.querySelector('.route-number')?.textContent;
  const fallback = number === '01' ? ['Memoria','Contexto'] : number === '02' ? ['Instituciones'] : ['Capacidades','Pensamiento'];
  return documents.find(doc => fallback.includes(domainOf(doc))) || documents[0];
}

function renderRoutes(){
  document.querySelectorAll('.route').forEach(button => {
    button.addEventListener('click',() => openReader(routeDocument(button)));
  });
}

function renderRecent(){
  const curatedIds = [
    'linea-tiempo-venezuela',
    '08-estado-del-pais--foto-2026',
    'idea-construccion-capacidades',
    'institucion-cvg',
    'debate-agencia-dependencia'
  ];
  const selected = curatedIds.map(id => documents.find(doc => doc.id === id)).filter(Boolean);
  const list = document.getElementById('recent-list');
  list.innerHTML = selected.map((doc,index) => `
    <button class="ledger-row" data-id="${escapeHtml(doc.id)}">
      <span class="index">${String(index+1).padStart(2,'0')}</span>
      <span class="title">${escapeHtml(doc.title)}</span>
      <span class="domain">${escapeHtml(domainOf(doc))}</span>
      <span>→</span>
    </button>`).join('');
  list.querySelectorAll('button').forEach(button => {
    button.addEventListener('click',() => {
      const doc = documents.find(item => item.id === button.dataset.id);
      renderFeatured(doc);
    });
  });
  renderFeatured(selected[0]);
}

function renderFeatured(doc){
  if(!doc) return;
  const target = document.getElementById('featured-reading');
  target.innerHTML = `
    <small>${escapeHtml(domainOf(doc))}</small>
    <strong>${escapeHtml(doc.title)}</strong>
    <p>${escapeHtml(doc.excerpt || 'Una lectura del corpus de Venezuela Futura.')}</p>
    <button type="button">Leer documento →</button>`;
  target.querySelector('button').addEventListener('click',() => openReader(doc));
}

function renderFilters(){
  const target = document.getElementById('domain-filters');
  const available = ['Todos',...new Set(documents.map(domainOf))];
  target.innerHTML = available.map(name =>
    `<button type="button" data-domain="${escapeHtml(name)}" class="${name===activeDomain?'active':''}">${escapeHtml(name)}</button>`
  ).join('');
  target.querySelectorAll('button').forEach(button => button.addEventListener('click',() => {
    activeDomain = button.dataset.domain;
    renderFilters();
    renderDocuments(document.getElementById('search').value);
  }));
}

function matches(doc,query){
  if(activeDomain !== 'Todos' && domainOf(doc) !== activeDomain) return false;
  if(!query) return true;
  return [doc.title,doc.excerpt,doc.path,doc.type,...(doc.topics||[])]
    .join(' ').toLowerCase().includes(query.toLowerCase());
}

function renderDocuments(query=''){
  const visible = documents.filter(doc => matches(doc,query));
  document.getElementById('result-count').textContent = `${visible.length} lecturas`;
  document.getElementById('documents').innerHTML = visible.map(doc => `
    <button class="document-row" data-id="${escapeHtml(doc.id)}">
      <span class="meta">${escapeHtml(domainOf(doc))}<br>${escapeHtml(doc.type)}</span>
      <strong>${escapeHtml(doc.title)}</strong>
      <p>${escapeHtml(doc.excerpt || 'Documento del corpus.')}</p>
      <span>→</span>
    </button>`).join('') || '<p>No hay coincidencias para esta búsqueda.</p>';
  document.querySelectorAll('.document-row').forEach(button => button.addEventListener('click',() => {
    openReader(documents.find(doc => doc.id === button.dataset.id));
  }));
}

function renderLegend(){
  document.getElementById('legend').innerHTML = `
    <span><i class="line-key"></i>Documentada</span>
    <span><i class="line-key dashed"></i>Interpretativa</span>
    <span><i class="line-key dotted"></i>Inferida</span>`;
}

function renderGraph(){
  const container = document.getElementById('graph');
  const summary = document.getElementById('graph-summary');
  const select = document.getElementById('graph-domain-select');
  const detail = document.getElementById('graph-detail');
  if(!window.cytoscape || !relations.length){
    container.innerHTML = '<p>El grafo crecerá cuando el corpus incorpore relaciones estructuradas.</p>';
    return;
  }
  const docsById = new Map(documents.map(doc => [doc.id,doc]));
  const domainCounts = new Map();
  documents.forEach(doc => domainCounts.set(domainOf(doc),(domainCounts.get(domainOf(doc)) || 0) + 1));
  const domainNames = [...domainCounts.keys()].sort((a,b) => domainCounts.get(b) - domainCounts.get(a));
  const domainIds = new Map(domainNames.map((name,index) => [name,`domain-${index}`]));
  const pairCounts = new Map();
  relations.forEach(rel => {
    const sourceDoc = docsById.get(rel.source);
    const targetDoc = docsById.get(rel.target);
    if(!sourceDoc || !targetDoc) return;
    const pair = [domainOf(sourceDoc),domainOf(targetDoc)].sort();
    const key = pair.join('||');
    pairCounts.set(key,(pairCounts.get(key) || 0) + 1);
  });
  const nodes = domainNames.map(name => ({
    data:{id:domainIds.get(name),label:name,docCount:domainCounts.get(name),domain:name}
  }));
  const edges = [...pairCounts.entries()].filter(([key]) => {
    const [source,target] = key.split('||');
    return source !== target;
  }).map(([key,count],index) => {
    const [source,target] = key.split('||');
    return {data:{id:`domain-relation-${index}`,source:domainIds.get(source),target:domainIds.get(target),count}};
  });
  summary.textContent = `${relations.length} relaciones · ${domainNames.length} ámbitos`;
  select.innerHTML = domainNames.map(name => `<option value="${escapeHtml(name)}">${escapeHtml(name)} · ${domainCounts.get(name)} lecturas</option>`).join('');
  const renderDomainDetail = domain => {
    const domainDocs = documents.filter(doc => domainOf(doc) === domain).slice(0,4);
    detail.innerHTML = `
      <div><small>Ámbito seleccionado</small><strong>${escapeHtml(domain)}</strong></div>
      <div class="graph-reading-list">${domainDocs.map(doc => `<button type="button" data-id="${escapeHtml(doc.id)}">${escapeHtml(doc.title)} <span>→</span></button>`).join('')}</div>`;
    detail.querySelectorAll('button').forEach(button => button.addEventListener('click',() => {
      openReader(documents.find(doc => doc.id === button.dataset.id));
    }));
  };
  const cy = cytoscape({
    container,
    elements:[...nodes,...edges],
    style:[
      {selector:'node',style:{
        'label':'data(label)','background-color':'#173f5f','color':'#ffffff',
        'font-family':'DM Sans','font-size':9,'font-weight':600,'text-wrap':'wrap','text-max-width':62,
        'text-valign':'center','text-halign':'center',
        'width':'mapData(docCount,1,21,56,82)','height':'mapData(docCount,1,21,56,82)',
        'border-width':3,'border-color':'#ffffff'
      }},
      {selector:'edge',style:{
        'width':'mapData(count,1,16,1,4)','line-color':'#9fb1bf','curve-style':'bezier','opacity':.52
      }},
      {selector:'node:selected',style:{'background-color':'#9a7430','border-color':'#eadfc8'}}
    ],
    layout:{name:'circle',animate:false,fit:true,padding:82,avoidOverlap:true,startAngle:-Math.PI/2}
  });
  cy.on('tap','node',event => {
    const domain = event.target.data('domain');
    select.value = domain;
    renderDomainDetail(domain);
  });
  select.addEventListener('change',() => {
    const node = cy.getElementById(domainIds.get(select.value));
    cy.elements().unselect();
    node.select();
    renderDomainDetail(select.value);
  });
  select.dispatchEvent(new Event('change'));
}

function buildToc(){
  const headings = [...document.querySelectorAll('#reader-body h2, #reader-body h3')];
  const toc = document.getElementById('reader-toc');
  toc.innerHTML = headings.slice(0,10).map((heading,index) => {
    const id = `reader-section-${index}`;
    heading.id = id;
    return `<a href="#${id}">${escapeHtml(heading.textContent)}</a>`;
  }).join('');
}

function normalizeTitle(value){
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-zA-Z0-9]+/g,' ').trim().toLowerCase();
}

function cleanMarkdown(markdown,documentTitle){
  let clean = markdown.replace(/^\uFEFF/,'');
  clean = clean.replace(/^---\s*\r?\n[\s\S]*?\r?\n---\s*(?:\r?\n|$)/,'');
  const firstHeading = clean.match(/^\s*#\s+(.+?)\s*(?:\r?\n|$)/);
  if(firstHeading && normalizeTitle(firstHeading[1]) === normalizeTitle(documentTitle)){
    clean = clean.slice(firstHeading[0].length);
  }
  return clean.trim();
}

async function openReader(doc){
  if(!doc) return;
  const reader = document.getElementById('reader');
  const body = document.getElementById('reader-body');
  const currentFocus = document.activeElement;
  readerReturnFocus = document.getElementById('search-dialog').contains(currentFocus)
    ? document.querySelector('.search-trigger')
    : currentFocus;
  document.getElementById('reader-title').textContent = doc.title;
  document.getElementById('reader-path').textContent = doc.path;
  const source = document.getElementById('reader-source');
  source.href = repoBlob + encodeURI(doc.path);
  body.innerHTML = '<p>Cargando lectura…</p>';
  reader.classList.add('open');
  reader.removeAttribute('inert');
  reader.setAttribute('aria-hidden','false');
  document.getElementById('reader-backdrop').classList.add('open');
  document.body.classList.add('reader-open');
  document.getElementById('reader-close').focus();
  try{
    const response = await fetch(encodeURI(doc.path),{cache:'no-store'});
    if(!response.ok) throw new Error('No se pudo abrir el documento');
    const markdown = cleanMarkdown(await response.text(),doc.title);
    body.innerHTML = window.marked && window.DOMPurify
      ? DOMPurify.sanitize(marked.parse(markdown))
      : `<pre>${escapeHtml(markdown)}</pre>`;
    buildToc();
    history.replaceState(null,'',`?doc=${encodeURIComponent(doc.id)}`);
  }catch(error){
    body.innerHTML = `<p>No fue posible cargar esta lectura. <a href="${source.href}">Abrirla en GitHub</a>.</p>`;
  }
}

function closeReader(){
  const reader = document.getElementById('reader');
  if(!reader.classList.contains('open')) return;
  reader.classList.remove('open');
  reader.setAttribute('aria-hidden','true');
  reader.setAttribute('inert','');
  document.getElementById('reader-backdrop').classList.remove('open');
  document.body.classList.remove('reader-open');
  history.replaceState(null,'',location.pathname);
  if(readerReturnFocus?.isConnected) readerReturnFocus.focus();
}

function setupReader(){
  document.getElementById('reader-close').addEventListener('click',closeReader);
  document.getElementById('reader-backdrop').addEventListener('click',closeReader);
  document.addEventListener('keydown',event => {
    if(event.key === 'Escape' && document.getElementById('reader').classList.contains('open')) closeReader();
  });
}

function searchResults(query){
  return documents.filter(doc => {
    const text = [doc.title,doc.excerpt,doc.path,...(doc.topics||[])].join(' ').toLowerCase();
    return text.includes(query.toLowerCase());
  }).slice(0,10);
}

function setupSearch(){
  const dialog = document.getElementById('search-dialog');
  const input = document.getElementById('dialog-search');
  const results = document.getElementById('dialog-results');
  const guidance = document.getElementById('search-guidance');
  const open = () => {
    dialog.showModal();
    setTimeout(() => input.focus(),20);
  };
  document.querySelector('.search-trigger').addEventListener('click',open);
  document.addEventListener('keydown',event => {
    if(event.key==='/' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){
      event.preventDefault(); open();
    }
  });
  input.addEventListener('input',() => {
    const found = input.value.trim() ? searchResults(input.value.trim()) : [];
    guidance.textContent = input.value.trim()
      ? `${found.length} ${found.length === 1 ? 'resultado' : 'resultados'}`
      : 'Busca una idea, persona, institución o episodio.';
    results.innerHTML = found.map(doc => `
      <button type="button" class="dialog-result" data-id="${escapeHtml(doc.id)}">
        <strong>${escapeHtml(doc.title)}</strong><small>${escapeHtml(domainOf(doc))}</small>
      </button>`).join('');
    results.querySelectorAll('button').forEach(button => button.addEventListener('click',() => {
      dialog.close();
      openReader(documents.find(doc => doc.id === button.dataset.id));
    }));
  });
  document.getElementById('search').addEventListener('input',event => renderDocuments(event.target.value));
}

async function init(){
  setupReader();
  try{
    await loadData();
    renderStatus();
    renderFlow();
    renderRoutes();
    renderRecent();
    renderFilters();
    renderDocuments();
    renderLegend();
    renderGraph();
    setupSearch();
    const requested = new URLSearchParams(location.search).get('doc');
    if(requested) openReader(documents.find(doc => doc.id === requested));
  }catch(error){
    console.error(error);
    document.getElementById('corpus-status').textContent = 'Índice no disponible';
    document.getElementById('documents').innerHTML = '<p>No se pudo cargar el índice generado. Consulta GitHub Actions.</p>';
  }
}
document.addEventListener('DOMContentLoaded',init);

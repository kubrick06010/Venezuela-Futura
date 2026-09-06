const repoBase = 'https://github.com/kubrick06010/Venezuela-Futura/blob/main/';
let documents = [];
let relations = [];
let timeline = [];

const typeColors = {
  persona: '#d7a84b',
  idea: '#78c6a3',
  debate: '#ef806f',
  institucion: '#7da8dd',
  obra: '#c59be8',
  lugar: '#9bb8df',
  documento: '#7890a8'
};

async function loadData(){
  const [docsRes, relRes, timelineRes] = await Promise.all([
    fetch('site-data/content.json', {cache:'no-store'}),
    fetch('site-data/relations.json', {cache:'no-store'}),
    fetch('data/timeline.json', {cache:'no-store'})
  ]);
  if (!docsRes.ok) throw new Error('No se pudo cargar el índice de contenido');
  documents = await docsRes.json();
  relations = relRes.ok ? await relRes.json() : [];
  timeline = timelineRes.ok ? await timelineRes.json() : [];
}

function renderChapters(filter=''){
  const target = document.getElementById('chapters');
  const q = filter.trim().toLowerCase();
  const visible = documents.filter(d => !q || [d.type,d.title,d.excerpt,d.path,...(d.topics||[])].join(' ').toLowerCase().includes(q));
  target.innerHTML = visible.map(d => `<a class="card" href="${repoBase}${encodeURI(d.path)}"><span class="tag">${d.type}</span><h3>${d.title}</h3><p>${d.excerpt || 'Documento del corpus.'}</p><small>${d.path}</small></a>`).join('') || '<p>No hay coincidencias.</p>';
  document.getElementById('content-count').textContent = `${documents.length} documentos indexados · ${relations.length} relaciones explícitas`;
}

function renderTimeline(){
  const target = document.getElementById('timeline');
  if (!timeline.length) { target.innerHTML = '<p>No hay hitos estructurados todavía.</p>'; return; }
  const docById = new Map(documents.map(d => [d.id,d]));
  const sorted = [...timeline].sort((a,b) => (a.year ?? a.start_year ?? 9999) - (b.year ?? b.start_year ?? 9999));
  target.innerHTML = sorted.map(item => {
    const year = item.year ?? `${item.start_year}–${item.end_year ?? ''}`;
    const linked = (item.related || []).map(id => docById.get(id)).filter(Boolean);
    const links = linked.length ? `<div class="timeline-links">${linked.map(d => `<a href="${repoBase}${encodeURI(d.path)}">${d.title}</a>`).join('')}</div>` : '';
    return `<article class="timeline-item"><div class="timeline-year">${year}</div><div class="timeline-body"><span class="timeline-type">${item.type}</span><h3>${item.label}</h3>${links}</div></article>`;
  }).join('');
}

function renderSystems(){
  const focus = documents.filter(d => d.path.startsWith('08-estado-del-pais/'));
  document.getElementById('systems').innerHTML = focus.map(d => `<tr><td>${d.title}</td><td>${d.excerpt}</td><td><a href="${repoBase}${encodeURI(d.path)}">abrir fuente</a></td></tr>`).join('');
}

function renderLegend(){
  const types = [...new Set(documents.map(d => d.type))].sort();
  const typeLegend = types.map(t => `<span><i class="dot" style="background:${typeColors[t] || typeColors.documento}"></i>${t}</span>`).join('');
  const confidenceLegend = `
    <span title="Relación respaldada directamente por la fuente"><i class="line-key solid"></i>documentada</span>
    <span title="Relación plausible que requiere más documentación"><i class="line-key dotted"></i>inferida</span>
    <span title="Lectura construida explícitamente por Venezuela Futura"><i class="line-key dashed"></i>interpretativa</span>`;
  document.getElementById('legend').innerHTML = typeLegend + confidenceLegend;
}

function renderGraph(){
  const graph = document.getElementById('graph');
  if (!window.cytoscape || !relations.length) {
    graph.innerHTML = '<p class="graph-empty">El grafo crecerá automáticamente a medida que el corpus incorpore relaciones estructuradas.</p>';
    return;
  }
  const ids = new Set(relations.flatMap(r => [r.source,r.target]));
  const nodes = documents.filter(d => ids.has(d.id)).map(d => ({data:{id:d.id,label:d.title,type:d.type,path:d.path}}));
  const edges = relations.map((r,i) => ({data:{id:`r${i}`,source:r.source,target:r.target,label:r.type||'relacionado',confidence:r.confidence||'sin-clasificar'}}));
  const cy = cytoscape({
    container: graph,
    elements:[...nodes,...edges],
    style:[
      {selector:'node',style:{'label':'data(label)','background-color':typeColors.documento,'color':'#f4efe6','font-size':12,'text-wrap':'wrap','text-max-width':125,'text-valign':'center','text-halign':'center','width':72,'height':72,'border-color':'rgba(255,255,255,.35)','border-width':1}},
      {selector:'node[type="persona"]',style:{'background-color':typeColors.persona,'shape':'ellipse'}},
      {selector:'node[type="idea"]',style:{'background-color':typeColors.idea,'shape':'round-rectangle','width':104,'height':58}},
      {selector:'node[type="debate"]',style:{'background-color':typeColors.debate,'shape':'diamond','width':92,'height':92}},
      {selector:'node[type="institucion"]',style:{'background-color':typeColors.institucion,'shape':'hexagon'}},
      {selector:'node[type="obra"]',style:{'background-color':typeColors.obra,'shape':'tag','width':96}},
      {selector:'node[type="documento"]',style:{'background-color':typeColors.documento,'shape':'round-rectangle','width':92,'height':54}},
      {selector:'edge',style:{'width':1.6,'line-color':'rgba(244,239,230,.44)','target-arrow-color':'rgba(244,239,230,.44)','target-arrow-shape':'triangle','curve-style':'bezier','label':'data(label)','font-size':8,'color':'rgba(244,239,230,.76)','text-rotation':'autorotate','text-margin-y':-9}},
      {selector:'edge[confidence="inferida"]',style:{'line-style':'dotted','opacity':.72}},
      {selector:'edge[confidence="interpretativa"]',style:{'line-style':'dashed','opacity':.58}},
      {selector:'edge[confidence="documentada"]',style:{'line-style':'solid','opacity':.95}}
    ],
    layout:{name:'cose',animate:false,fit:true,padding:38,nodeRepulsion:11000,idealEdgeLength:135}
  });
  cy.on('tap','node',evt => window.open(repoBase + encodeURI(evt.target.data('path')), '_self'));
}

function setupNavigation(){
  const toggle = document.querySelector('.toc-toggle');
  const mobile = document.getElementById('mobile-toc');
  if (toggle && mobile) {
    toggle.addEventListener('click', () => {
      const open = mobile.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    mobile.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      mobile.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  const sections = [...document.querySelectorAll('main > section[id]')];
  const links = [...document.querySelectorAll('.toc-nav a[data-section]')];
  if (!sections.length || !links.length) return;
  const byId = new Map(links.map(link => [link.dataset.section, link]));
  const activate = id => links.forEach(link => link.classList.toggle('active', link === byId.get(id)));
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) activate(visible.target.id);
  }, {rootMargin:'-18% 0px -58% 0px', threshold:[0,.2,.5,.8]});
  sections.forEach(section => observer.observe(section));
}

async function init(){
  setupNavigation();
  try {
    await loadData();
    renderChapters(); renderTimeline(); renderSystems(); renderLegend(); renderGraph();
    document.getElementById('search').addEventListener('input', e => renderChapters(e.target.value));
  } catch(err) {
    console.error(err);
    document.getElementById('chapters').innerHTML = '<p>No se pudo cargar el índice generado. Consulta el estado del build en GitHub Actions.</p>';
  }
}

document.addEventListener('DOMContentLoaded', init);

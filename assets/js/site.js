const repoBase = 'https://github.com/kubrick06010/Venezuela-Futura/blob/main/';
let documents = [];
let relations = [];

async function loadData(){
  const [docsRes, relRes] = await Promise.all([
    fetch('site-data/content.json', {cache:'no-store'}),
    fetch('site-data/relations.json', {cache:'no-store'})
  ]);
  if (!docsRes.ok) throw new Error('No se pudo cargar el índice de contenido');
  documents = await docsRes.json();
  relations = relRes.ok ? await relRes.json() : [];
}

function renderChapters(filter=''){
  const target = document.getElementById('chapters');
  const q = filter.trim().toLowerCase();
  const visible = documents.filter(d => !q || [d.type,d.title,d.excerpt,d.path,...(d.topics||[])].join(' ').toLowerCase().includes(q));
  target.innerHTML = visible.map(d => `<a class="card" href="${repoBase}${encodeURI(d.path)}"><span class="tag">${d.type}</span><h3>${d.title}</h3><p>${d.excerpt || 'Documento del corpus.'}</p><small>${d.path}</small></a>`).join('') || '<p>No hay coincidencias.</p>';
  document.getElementById('content-count').textContent = `${documents.length} documentos indexados`;
}

function renderSystems(){
  const focus = documents.filter(d => d.path.startsWith('08-estado-del-pais/'));
  document.getElementById('systems').innerHTML = focus.map(d => `<tr><td>${d.title}</td><td>${d.excerpt}</td><td><a href="${repoBase}${encodeURI(d.path)}">abrir fuente</a></td></tr>`).join('');
}

function renderLegend(){
  const types = [...new Set(documents.map(d => d.type))].sort();
  document.getElementById('legend').innerHTML = types.map(t => `<span><i class="dot"></i>${t}</span>`).join('');
}

function renderGraph(){
  const graph = document.getElementById('graph');
  if (!window.cytoscape || !relations.length) {
    graph.innerHTML = '<p class="graph-empty">El grafo crecerá automáticamente a medida que el corpus incorpore relaciones estructuradas.</p>';
    return;
  }
  const ids = new Set(relations.flatMap(r => [r.source,r.target]));
  const nodes = documents.filter(d => ids.has(d.id)).map(d => ({data:{id:d.id,label:d.title,type:d.type,path:d.path}}));
  const edges = relations.map((r,i) => ({data:{id:`r${i}`,source:r.source,target:r.target,label:r.type||'relacionado',confidence:r.confidence||''}}));
  const cy = cytoscape({
    container: graph,
    elements:[...nodes,...edges],
    style:[
      {selector:'node',style:{'label':'data(label)','background-color':'#d7a84b','color':'#f4efe6','font-size':12,'text-wrap':'wrap','text-max-width':120,'text-valign':'center','text-halign':'center','width':68,'height':68,'border-color':'rgba(255,255,255,.35)','border-width':1}},
      {selector:'node[type="documento"]',style:{'background-color':'#78a88f','shape':'round-rectangle','width':92,'height':54}},
      {selector:'node[type="persona"]',style:{'background-color':'#d7a84b'}},
      {selector:'node[type="institucion"]',style:{'background-color':'#7da8dd','shape':'hexagon'}},
      {selector:'edge',style:{'width':1.4,'line-color':'rgba(244,239,230,.34)','target-arrow-color':'rgba(244,239,230,.34)','target-arrow-shape':'triangle','curve-style':'bezier','label':'data(label)','font-size':8,'color':'rgba(244,239,230,.7)','text-rotation':'autorotate','text-margin-y':-8}}
    ],
    layout:{name:'cose',animate:false,fit:true,padding:34,nodeRepulsion:9000,idealEdgeLength:125}
  });
  cy.on('tap','node',evt => window.open(repoBase + encodeURI(evt.target.data('path')), '_self'));
}

async function init(){
  try {
    await loadData();
    renderChapters(); renderSystems(); renderLegend(); renderGraph();
    document.getElementById('search').addEventListener('input', e => renderChapters(e.target.value));
  } catch(err) {
    console.error(err);
    document.getElementById('chapters').innerHTML = '<p>No se pudo cargar el índice generado. Consulta el estado del build en GitHub Actions.</p>';
  }
}

document.addEventListener('DOMContentLoaded', init);

const repoBase = 'https://github.com/kubrick06010/Venezuela-Futura/blob/main/';

const chapters = [
  {tag:'principios', title:'Principios', path:'00-principios/README.md', text:'Brújula ética y metodológica: un país no es una empresa, derechos, pluralismo, mantenimiento, generaciones futuras.'},
  {tag:'contexto', title:'Venezuela en el mundo', path:'01-contexto/README.md', text:'Mundo, geopolítica, vecinos, diáspora, factores internos/externos, shocks y respuestas.'},
  {tag:'sociedad', title:'Cómo aprendimos a ser venezolanos', path:'01-contexto/sociedad-venezolana/como-aprendimos-a-ser-venezolanos.md', text:'Identidad, confianza, informalidad, Estado mágico, renta, representaciones y cultura institucional.'},
  {tag:'memoria', title:'Notas fundacionales', path:'02-memoria/notas-fundacionales.md', text:'Snapshot de ideas, hipótesis, nombres y preguntas abiertas recopiladas durante la fase inicial.'},
  {tag:'ideas', title:'Pensamiento venezolano', path:'03-pensamiento-venezolano/README.md', text:'Personas, debates, obras, instituciones y relaciones intelectuales para entender cómo Venezuela pensó Venezuela.'},
  {tag:'territorio', title:'Territorio y naturaleza', path:'04-territorio/README.md', text:'Guayana, Orinoco, Andes, Caribe, parques, cuencas, regiones y el principio de conocer antes de transformar.'},
  {tag:'instituciones', title:'Trayectorias institucionales', path:'05-instituciones/README.md', text:'Cómo nacen, maduran, se adaptan o se deterioran instituciones como CVG, EDELCA, INOS, Metro, IVIC o COPRE.'},
  {tag:'capacidades', title:'Capacidades humanas', path:'06-capacidades/README.md', text:'Oficios, educación técnica, universidades, ciencia, becas, aprendizaje institucional y dignidad del saber hacer.'},
  {tag:'diseño', title:'Diseño institucional', path:'07-diseno-institucional/README.md', text:'Cultura, incentivos, selección, formación, controles y conductas realmente inducidas por cada diseño.'},
  {tag:'foto', title:'Foto 2026', path:'08-estado-del-pais/foto-2026.md', text:'Población, macroeconomía, servicios, pobreza, petróleo, instituciones e incertidumbres de medición.'},
  {tag:'personas', title:'Capa humana 2025–2026', path:'08-estado-del-pais/capa-humana-2025-2026.md', text:'Demografía, pobreza, educación, trabajo, hogares, diáspora y comunidad humana venezolana.'},
  {tag:'material', title:'Capacidad material 2026', path:'08-estado-del-pais/capacidad-material-2026.md', text:'Infraestructura instalada, disponible, utilizada, recuperable o reemplazable.'},
  {tag:'servicios', title:'Sistemas esenciales', path:'08-estado-del-pais/sistemas-esenciales.md', text:'Agua, electricidad, saneamiento, resiliencia, continuidad, calidad y mantenimiento.'},
  {tag:'fuentes', title:'Fuentes y predecesores', path:'sources/predecesores.md', text:'Proyectos, obras, hojas de ruta e instituciones que anteceden o alimentan Venezuela Futura.'}
];

const systems = [
  ['Electricidad','¿Qué diferencia hay entre capacidad instalada, disponible y servicio real?','08-estado-del-pais/capacidad-material-2026.md'],
  ['Agua y saneamiento','¿Cuánta población recibe servicio continuo, seguro y con tratamiento posterior?','08-estado-del-pais/sistemas-esenciales.md'],
  ['Petróleo y gas','¿Qué parte del recurso geológico es realmente capacidad productiva y renta neta?','08-estado-del-pais/capacidad-material-2026.md'],
  ['Industria','¿Qué capacidad privada sobrevivió y qué cuellos de botella la limitan?','08-estado-del-pais/capacidad-material-2026.md'],
  ['Educación','¿Qué implica una generación con asistencia irregular y pérdida docente?','08-estado-del-pais/capa-humana-2025-2026.md'],
  ['Diáspora','¿Cómo incorporar capacidades fuera del territorio nacional?','08-estado-del-pais/capa-humana-2025-2026.md']
];

function renderChapters(filter=''){
  const target = document.getElementById('chapters');
  const q = filter.trim().toLowerCase();
  target.innerHTML = chapters
    .filter(c => !q || [c.tag,c.title,c.text,c.path].join(' ').toLowerCase().includes(q))
    .map(c => `<a class="card" href="${repoBase}${c.path}"><span class="tag">${c.tag}</span><h3>${c.title}</h3><p>${c.text}</p></a>`)
    .join('') || '<p>No hay coincidencias todavía.</p>';
}

function renderSystems(){
  document.getElementById('systems').innerHTML = systems.map(row =>
    `<tr><td>${row[0]}</td><td>${row[1]}</td><td><a href="${repoBase}${row[2]}">${row[2]}</a></td></tr>`
  ).join('');
}

function renderLegend(){
  const colors = {persona:'#f1b84b', idea:'#78c6a3', institucion:'#8bb7ff', obra:'#ef806f', lugar:'#c6a4ff'};
  document.getElementById('legend').innerHTML = Object.entries(colors).map(([k,v]) => `<span><i class="dot" style="background:${v}"></i>${k}</span>`).join('');
}

function renderGraph(){
  const elements = [
    {data:{id:'adriani',label:'Alberto Adriani',type:'persona'}},
    {data:{id:'uslar',label:'Arturo Uslar Pietri',type:'persona'}},
    {data:{id:'perez',label:'Juan Pablo Pérez Alfonzo',type:'persona'}},
    {data:{id:'baptista',label:'Asdrúbal Baptista',type:'persona'}},
    {data:{id:'rangel',label:'Carlos Rangel',type:'persona'}},
    {data:{id:'caballero',label:'Manuel Caballero',type:'persona'}},
    {data:{id:'coronil',label:'Fernando Coronil',type:'persona'}},
    {data:{id:'cabrujas',label:'José Ignacio Cabrujas',type:'persona'}},
    {data:{id:'montero',label:'Maritza Montero',type:'persona'}},
    {data:{id:'ravard',label:'Rafael Alfonzo Ravard',type:'persona'}},
    {data:{id:'petroleo',label:'renta petrolera',type:'idea'}},
    {data:{id:'diversificacion',label:'diversificación',type:'idea'}},
    {data:{id:'estado-magico',label:'Estado mágico',type:'idea'}},
    {data:{id:'disimulo',label:'Estado del disimulo',type:'idea'}},
    {data:{id:'identidad',label:'identidad nacional',type:'idea'}},
    {data:{id:'opep',label:'OPEP',type:'institucion'}},
    {data:{id:'cvg',label:'CVG',type:'institucion'}},
    {data:{id:'guri',label:'Guri',type:'lugar'}},
    {data:{id:'suma',label:'Suma del pensar venezolano',type:'obra'}},
    {data:{source:'adriani',target:'diversificacion',label:'plantea'}},
    {data:{source:'uslar',target:'diversificacion',label:'retoma'}},
    {data:{source:'uslar',target:'petroleo',label:'discute'}},
    {data:{source:'perez',target:'petroleo',label:'prudencia rentística'}},
    {data:{source:'perez',target:'opep',label:'impulsa'}},
    {data:{source:'baptista',target:'petroleo',label:'capitalismo rentístico'}},
    {data:{source:'coronil',target:'estado-magico',label:'formula'}},
    {data:{source:'cabrujas',target:'disimulo',label:'formula'}},
    {data:{source:'rangel',target:'caballero',label:'controversia'}},
    {data:{source:'rangel',target:'petroleo',label:'responsabilidad / mitos'}},
    {data:{source:'montero',target:'identidad',label:'estudia'}},
    {data:{source:'ravard',target:'cvg',label:'construye'}},
    {data:{source:'cvg',target:'guri',label:'capacidad'}},
    {data:{source:'suma',target:'identidad',label:'organiza debates'}},
    {data:{source:'suma',target:'petroleo',label:'organiza debates'}},
    {data:{source:'estado-magico',target:'disimulo',label:'tensión conceptual'}}
  ];
  cytoscape({
    container: document.getElementById('graph'),
    elements,
    style: [
      {selector:'node',style:{'label':'data(label)','background-color':'#f1b84b','color':'#f4efe6','font-size':13,'text-wrap':'wrap','text-max-width':120,'text-valign':'center','text-halign':'center','width':62,'height':62,'border-color':'rgba(255,255,255,.35)','border-width':1}},
      {selector:'node[type="idea"]',style:{'background-color':'#78c6a3','shape':'round-rectangle','width':86,'height':48}},
      {selector:'node[type="institucion"]',style:{'background-color':'#8bb7ff','shape':'hexagon'}},
      {selector:'node[type="obra"]',style:{'background-color':'#ef806f','shape':'tag','width':96}},
      {selector:'node[type="lugar"]',style:{'background-color':'#c6a4ff','shape':'diamond'}},
      {selector:'edge',style:{'width':1.4,'line-color':'rgba(244,239,230,.34)','target-arrow-color':'rgba(244,239,230,.34)','target-arrow-shape':'triangle','curve-style':'bezier','label':'data(label)','font-size':8,'color':'rgba(244,239,230,.7)','text-rotation':'autorotate','text-margin-y':-8}}
    ],
    layout:{name:'cose',animate:false,fit:true,padding:34,nodeRepulsion:9000,idealEdgeLength:115}
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderChapters();
  renderSystems();
  renderLegend();
  renderGraph();
  document.getElementById('search').addEventListener('input', e => renderChapters(e.target.value));
});

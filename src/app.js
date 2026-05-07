// Landing Page and Dashboard JavaScript
const STORAGE_KEY = 'xspreadsheet_projects';
let currentProjectId = null;
let spreadsheetInstance = null;

const templates = {
  basic: { name: 'Basic Template', data: { name: 'Sheet1', freeze: 'B3', styles: [{bgcolor:'#fff',align:'left',valign:'middle',textwrap:false,strike:false,underline:false,color:'#0a0a0a',font:{name:'Arial',size:10,bold:false,italic:false},format:'normal'}], merges: [], rows: {len:50,1:{cells:{0:{text:'Project Name'},1:{text:'Value'}}},2:{cells:{0:{text:'Item 1'},1:{text:100}}},3:{cells:{0:{text:'Item 2'},1:{text:200}}},4:{cells:{0:{text:'Item 3'},1:{text:300}}}, cols: {len:26,2:{width:150}} } },
  budget: { name: 'Budget Tracker', data: { name: 'Budget', freeze: 'C3', styles: [{bgcolor:'#fff',align:'left',valign:'middle',textwrap:false,strike:false,underline:false,color:'#0a0a0a',font:{name:'Arial',size:10,bold:false,italic:false},format:'normal'}], merges: [], rows: {len:50,1:{cells:{0:{text:'Category'},1:{text:'Budget'},2:{text:'Actual'},3:{text:'Difference'}}},2:{cells:{0:{text:'Revenue'},1:{text:10000},2:{text:8500},3:{text:'-1500'}}},3:{cells:{0:{text:'Expenses'},1:{text:5000},2:{text:4800},3:{text:'-200'}}},4:{cells:{0:{text:'Supplies'},1:{text:2000},2:{text:1800},3:{text:'-200'}}},5:{cells:{0:{text:'Marketing'},1:{text:3000},2:{text:3200},3:{text:'200'}}}, cols: {len:26,2:{width:120},3:{width:120},4:{width:120}} } },
  datalog: { name: 'Data Log', data: { name: 'Log', freeze: 'D3', styles: [{bgcolor:'#fff',align:'left',valign:'middle',textwrap:false,strike:false,underline:false,color:'#0a0a0a',font:{name:'Arial',size:10,bold:false,italic:false},format:'normal'}], merges: [], rows: {len:50,1:{cells:{0:{text:'Date'},1:{text:'Description'},2:{text:'Amount'},3:{text:'Status'}}},2:{cells:{0:{text:'2025-01-01'},1:{text:'Sale'},2:{text:500},3:{text:'Completed'}}},3:{cells:{0:{text:'2025-01-02'},1:{text:'Refund'},2:{text:'-50'},3:{text:'Pending'}}},4:{cells:{0:{text:'2025-01-03'},1:{text:'Purchase'},2:{text:'-200'},3:{text:'Completed'}}},5:{cells:{0:{text:'2025-01-04'},1:{text:'Sale'},3:{text:'Processing'}}},6:{cells:{0:{text:'2025-01-05'},1:{text:'Discount'},2:{text:'-100'},3:{text:'Completed'}}}, cols: {len:26,2:{width:100},3:{width:100}} } },
  inventory: { name: 'Inventory', data: { name: 'Items', freeze: 'D3', styles: [{bgcolor:'#fff',align:'left',valign:'middle',textwrap:false,strike:false,underline:false,color:'#0a0a0a',font:{name:'Arial',size:10,bold:false,italic:false},format:'normal'}], merges: [], rows: {len:50,1:{cells:{0:{text:'Item'},1:{text:'Quantity'},2:{text:'Unit Price'},3:{text:'Total'}}},2:{cells:{0:{text:'Widget A'},1:{text:100},2:{text:9.99},3:{text:999}}},3:{cells:{0:{text:'Widget B'},1:{text:50},2:{text:24.99},3:{text:1249.5}}},4:{cells:{0:{text:'Gadget X'},1:{text:200},2:{text:4.99},3:{text:998}}},5:{cells:{0:{text:'Gadget Y'},1:{text:75},3:{text:374.25}}},6:{cells:{0:{text:'Tool Z'},2:{text:49.99},3:{text:499.9}}}, cols: {len:26,2:{width:100},3:{width:100}} } },
  multisheet: { name: 'Multi-sheet', data: { name: 'Summary', freeze: 'C3', styles: [{bgcolor:'#fff',align:'left',valign:'middle',textwrap:false,strike:false,underline:false,color:'#0a0a0a',font:{name:'Arial',size:10,bold:false,italic:false},format:'normal'}], merges: [], rows: {len:50,1:{cells:{0:{text:'Metric'},1:{text:'Value'},2:{text:'Change'}}},2:{cells:{0:{text:'Total Sales'},1:{text:5000},2:{text:'+15%'}}},3:{cells:{0:{text:'Total Orders'},1:{text:250},2:{text:'+8%'}}},4:{cells:{0:{text:'Avg Order'},1:{text:20},2:{text:'+5%'}}},5:{cells:{0:{text:'Returns'},1:{text:15},2:{text:'-2%'}}}, cols: {len:26,2:{width:100}} } }
};

const templatesMultisheet = [
  { name: 'Summary', rows: templates.multisheet.data.rows, cols: templates.multisheet.data.cols },
  { name: 'Details', rows: {len:50,1:{cells:{0:{text:'Order ID'},1:{text:'Date'},2:{text:'Amount'},3:{text:'Status'}}},2:{cells:{0:{text:'ORD-001'},1:{text:'2025-01-01'},2:{text:100},3:{text:'Shipped'}}},3:{cells:{0:{text:'ORD-002'},2:{text:250},3:{text:'Processing'}}},4:{cells:{0:{text:'ORD-003'},1:{text:'2025-01-03'},2:{text:150},3:{text:'Delivered'}}}, cols: {len:26,2:{width:100},3:{width:100}} } }
];

function getUrlParam(p) { return new URLSearchParams(location.search).get(p); }
function getProjects() { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
function saveProjects(p) { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); }
function generateId() { return 'proj_' + Date.now() + '_' + Math.random().toString(36).substr(2,9); }
function now() { return new Date().toISOString(); }

function formatDate(iso) {
  var d = new Date(iso), n = new Date(), diff = n - d, days = Math.floor(diff / 864e5);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return days + ' days ago';
  if (days < 30) return Math.floor(days/7) + ' weeks ago';
  return d.toLocaleDateString();
}

function toggleTemplates() { document.getElementById('templateDropdown').classList.toggle('show'); }

function renderProjects() {
  var p = getProjects(), g = document.getElementById('projectsGrid');
  if (!p.length) { g.innerHTML = '<div class="empty-state"><div class="empty-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="#9CA3AF"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/></svg></div><h3>No projects yet</h3><p>Create your first project to get started</p></div>'; return; }
  p.sort(function(a,b) { return new Date(b.modifiedAt) - new Date(a.modifiedAt); });
  g.innerHTML = p.map(function(proj) { return '<div class="project-card" onclick="openProject(\'' + proj.id + '\')"><button class="project-delete" onclick="event.stopPropagation();deleteProject(\'' + proj.id + '\')">×</button><div class="project-name">' + proj.name + '</div><div class="project-meta"><span>Modified ' + formatDate(proj.modifiedAt) + '</span><span>' + (proj.data && proj.data.rows && proj.data.rows.len || 0) + ' rows × ' + (proj.data && proj.data.cols && proj.data.cols.len || 0) + ' cols</span></div></div>'; }).join('');
}

function createProject(type) {
  var projects = getProjects(), t = templates[type];
  var sheetData = t.data;
  if (type === 'multisheet') sheetData = { name: templatesMultisheet[0].name, freeze: 'C3', styles: t.data.styles, merges: [], rows: templatesMultisheet[0].rows, cols: templatesMultisheet[0].cols };
  var newProj = { id: generateId(), name: t.name + ' ' + (projects.length+1), createdAt: now(), modifiedAt: now(), data: sheetData };
  projects.push(newProj);
  saveProjects(projects);
  document.getElementById('templateDropdown').classList.remove('show');
  location.href = '?project=' + newProj.id;
}

function deleteProject(id) {
  if (!confirm('Delete this project?')) return;
  var projects = getProjects().filter(function(p) { return p.id !== id; });
  saveProjects(projects);
  renderProjects();
}

function openProject(id) { location.href = '?project=' + id; }
function goToDashboard() { location.href = '?'; }

function saveCurrentProject() {
  if (!currentProjectId || !spreadsheetInstance) return;
  var projects = getProjects(), i = projects.findIndex(function(p) { return p.id === currentProjectId; });
  if (i > -1) {
    projects[i].data = spreadsheetInstance.getData()[0];
    projects[i].modifiedAt = now();
    saveProjects(projects);
    var btn = document.querySelector('.spreadsheet-page .btn-new');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>Saved!';
    setTimeout(function() { btn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>Save'; }, 1500);
  }
}

function loadSpreadsheet(id) {
  var p = getProjects().find(function(x) { return x.id === id; });
  if (!p) { goToDashboard(); return; }
  currentProjectId = id;
  document.getElementById('currentProjectName').textContent = p.name;
  var loadData = [p.data];
  spreadsheetInstance = x_spreadsheet('#x-spreadsheet-demo',{showToolbar:true,showGrid:true,showBottomBar:true}).loadData(loadData).change(function() {
    if (currentProjectId) {
      var ps = getProjects(), i = ps.findIndex(function(x) { return x.id === currentProjectId; });
      if (i > -1) ps[i].modifiedAt = now();
    }
  });
}

function init() {
  var id = getUrlParam('project');
  if (id) {
    document.getElementById('landing').classList.remove('active');
    document.getElementById('spreadsheetPage').classList.add('active');
    loadSpreadsheet(id);
  } else {
    document.getElementById('landing').classList.add('active');
    document.getElementById('spreadsheetPage').classList.remove('active');
    renderProjects();
  }
}

document.addEventListener('click', function(e) {
  if (!e.target.closest('#templateDropdown') && !e.target.closest('#newBtn')) {
    document.getElementById('templateDropdown').classList.remove('show');
  }
});

// Auto-init on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
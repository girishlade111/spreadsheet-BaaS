import { h } from './component/element';
import Spreadsheet from './index';
import './app.less';

class App {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      // If container doesn't exist, create one
      this.container = document.createElement('div');
      this.container.id = containerId;
      document.body.appendChild(this.container);
    }
    this.projects = this.loadProjects();
    this.currentProject = null;
    this.spreadsheet = null;
    this.init();
  }

  loadProjects() {
    const saved = localStorage.getItem('x-spreadsheet-projects');
    return saved ? JSON.parse(saved) : [];
  }

  saveProjects() {
    localStorage.setItem('x-spreadsheet-projects', JSON.stringify(this.projects));
  }

  init() {
    window.addEventListener('hashchange', () => this.route());
    this.route();
  }

  route() {
    const hash = window.location.hash;
    if (hash === '#dashboard') {
      this.renderDashboard();
    } else if (hash.startsWith('#project/')) {
      const id = hash.split('/')[1];
      this.renderProject(id);
    } else {
      this.renderLanding();
    }
  }

  renderLanding() {
    this.container.innerHTML = '';
    const landing = h('div', 'x-spreadsheet-landing')
      .children(
        h('h1').html('X-Spreadsheet'),
        h('p').html('A powerful, lightweight spreadsheet for the web.'),
        h('button', 'get-started-btn').html('Get Started')
          .on('click', () => {
            window.location.hash = '#dashboard';
          })
      );
    this.container.appendChild(landing.el);
  }

  renderDashboard() {
    this.container.innerHTML = '';
    const dashboard = h('div', 'x-spreadsheet-dashboard');
    
    const header = h('div', 'dashboard-header').children(
      h('h2').html('My Projects'),
      h('button', 'x-spreadsheet-button primary').html('New Project')
        .on('click', () => this.createNewProject())
    );

    const projectGrid = h('div', 'project-grid');

    // New Project Card
    const newCard = h('div', 'project-card new-project')
      .on('click', () => this.createNewProject())
      .children(
        h('div', 'project-icon').html('+'),
        h('div', 'project-name').html('Create New')
      );
    projectGrid.child(newCard);

    this.projects.forEach(p => {
      const card = h('div', 'project-card')
        .on('click', (e) => {
          // If they didn't click the delete button
          if (!e.target.classList.contains('delete-btn')) {
            window.location.hash = `#project/${p.id}`;
          }
        })
        .children(
          h('div', 'project-icon').html('📊'),
          h('div', 'project-name').html(p.name),
          h('div', 'project-date').html(`Modified: ${new Date(p.lastModified).toLocaleDateString()}`),
          h('button', 'delete-btn').html('Delete')
            .on('click', (e) => {
              e.stopPropagation();
              this.deleteProject(p.id);
            })
        );
      projectGrid.child(card);
    });

    dashboard.children(header, projectGrid);
    this.container.appendChild(dashboard.el);
  }

  createNewProject() {
    const id = Date.now().toString();
    const newProject = {
      id,
      name: `Untitled Spreadsheet ${this.projects.length + 1}`,
      lastModified: new Date().toISOString(),
      data: [{ name: 'sheet1', rows: { len: 80 } }]
    };
    this.projects.push(newProject);
    this.saveProjects();
    window.location.hash = `#project/${id}`;
  }

  deleteProject(id) {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projects = this.projects.filter(p => p.id !== id);
      this.saveProjects();
      this.renderDashboard();
    }
  }

  renderProject(id) {
    const project = this.projects.find(p => p.id === id);
    if (!project) {
      window.location.hash = '#dashboard';
      return;
    }
    this.currentProject = project;

    this.container.innerHTML = '';
    
    const view = h('div', 'spreadsheet-container');
    const header = h('div', 'spreadsheet-header').children(
      h('div', 'back-btn').html('← Back').on('click', () => {
        window.location.hash = '#dashboard';
      }),
      h('div', 'project-title').html(project.name),
      h('div', 'save-status').html('All changes saved')
    );

    const editorContainer = h('div', '').attr('id', 'x-spreadsheet-editor');
    
    view.children(header, editorContainer);
    this.container.appendChild(view.el);

    // Initialize the spreadsheet
    this.spreadsheet = new Spreadsheet('#x-spreadsheet-editor', {
      showToolbar: true,
      showGrid: true,
      showBottomBar: true,
    });

    this.spreadsheet.loadData(project.data);

    this.spreadsheet.change((data) => {
      project.data = this.spreadsheet.getData();
      project.lastModified = new Date().toISOString();
      this.saveProjects();
      const statusEl = header.el.querySelector('.save-status');
      if (statusEl) statusEl.innerText = 'Saving...';
      setTimeout(() => {
        if (statusEl) statusEl.innerText = 'All changes saved';
      }, 500);
    });
  }
}

export default App;
window.SpreadsheetApp = App;

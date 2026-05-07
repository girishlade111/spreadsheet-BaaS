import { h } from './component/element';
import Spreadsheet from './index';
import './app.less';

class App {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
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
    const landing = h('div', 'x-spreadsheet-landing');

    const nav = h('nav', 'landing-nav').children(
      h('div', 'nav-brand').children(
        h('div', 'brand-icon').html('📊'),
        h('span').html('X-Spreadsheet')
      ),
      h('div', 'nav-links').children(
        h('a').attr('href', '#dashboard').html('Dashboard'),
        h('a').attr('href', '#features').html('Features'),
        h('a').attr('href', '#pricing').html('Pricing'),
        h('a', 'nav-cta').attr('href', '#dashboard').html('Get Started')
      )
    );

    const hero = h('div', 'hero-section').children(
      h('div', 'hero-badge').children(
        h('span', 'badge-dot'),
        h('span').html('Powering next-gen data workflows')
      ),
      h('h1').html('Spreadsheet Intelligence <span>Reimagined</span>'),
      h('p', 'hero-subtitle').html('Experience the future of data management with AI-powered insights, real-time collaboration, and enterprise-grade security built for modern teams.'),
      h('div', 'hero-actions').children(
        h('button', 'primary-btn').html('Start Building Free').on('click', () => {
          window.location.hash = '#dashboard';
        }),
        h('button', 'secondary-btn').html('Watch Demo')
      )
    );

    const features = h('div', 'features-section').children(
      h('div', 'section-header').children(
        h('h2').html('Why Choose X-Spreadsheet'),
        h('p').html('Built for developers, loved by teams')
      ),
      h('div', 'features-grid').children(
        h('div', 'feature-card').children(
          h('div', 'feature-icon').html('⚡'),
          h('h3').html('Lightning Fast'),
          h('p').html('Built on canvas rendering engine with WebGL acceleration for smooth performance even with millions of cells.')
        ),
        h('div', 'feature-card').children(
          h('div', 'feature-icon').html('🔒'),
          h('h3').html('Enterprise Security'),
          h('p').html('End-to-end encryption, SOC 2 compliance, and granular permission controls keep your data safe.')
        ),
        h('div', 'feature-card').children(
          h('div', 'feature-icon').html('🤖'),
          h('h3').html('AI-Powered'),
          h('p').html('Smart formulas, auto-generated insights, and natural language queries transform how you work with data.')
        ),
        h('div', 'feature-card').children(
          h('div', 'feature-icon').html('🔄'),
          h('h3').html('Real-time Sync'),
          h('p').html('Multi-user collaboration with conflict resolution and offline-first architecture keeps teams in sync.')
        ),
        h('div', 'feature-card').children(
          h('div', 'feature-icon').html('📈'),
          h('h3').html('Advanced Analytics'),
          h('p').html('Built-in pivot tables, charts, and data visualization tools turn numbers into actionable insights.')
        ),
        h('div', 'feature-card').children(
          h('div', 'feature-icon').html('🔌'),
          h('h3').html('API First'),
          h('p').html('Comprehensive REST and GraphQL APIs with SDKs for all major languages enable deep integrations.')
        )
      )
    );

    const stats = h('div', 'stats-section').children(
      h('div', 'stats-grid').children(
        h('div', 'stat-item').children(
          h('div', 'stat-number').html('10M+'),
          h('div', 'stat-label').html('Cells Created')
        ),
        h('div', 'stat-item').children(
          h('div', 'stat-number').html('50K+'),
          h('div', 'stat-label').html('Active Users')
        ),
        h('div', 'stat-item').children(
          h('div', 'stat-number').html('99.9%'),
          h('div', 'stat-label').html('Uptime SLA')
        )
      )
    );

    const cta = h('div', 'cta-section').children(
      h('div', 'cta-content').children(
        h('h2').html('Ready to Transform Your Workflow?'),
        h('p').html('Join thousands of teams already building with X-Spreadsheet. Start your free trial today.'),
        h('button', 'cta-button').html('Get Started Now').on('click', () => {
          window.location.hash = '#dashboard';
        })
      )
    );

    const footer = h('footer', 'landing-footer').children(
      h('div', 'footer-left').html('© 2026 X-Spreadsheet. All rights reserved.'),
      h('div', 'footer-right').children(
        h('a').attr('href', '#').html('Privacy'),
        h('a').attr('href', '#').html('Terms'),
        h('a').attr('href', '#').html('Contact')
      )
    );

    landing.children(nav, hero, features, stats, cta, footer);
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
      h('input', 'project-title-input').val(project.name).on('input', (e) => {
        project.name = e.target.value;
        this.saveProjects();
      }),
      h('div', 'save-status').html('All changes saved')
    );

    const editorContainer = h('div', '').attr('id', 'x-spreadsheet-editor');
    
    view.children(header, editorContainer);
    this.container.appendChild(view.el);

    this.spreadsheet = new Spreadsheet('#x-spreadsheet-editor', {
      showToolbar: true,
      showGrid: true,
      showBottomBar: true,
      view: {
        height: () => document.documentElement.clientHeight - 50,
        width: () => document.documentElement.clientWidth,
      }
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
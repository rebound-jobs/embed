import { LitElement, html, css } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import twemoji from 'twemoji';

export class ReboundEmbed extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;

      --background-color: white;
      --background-hover-color: rgba(0,0,0,0.03);
      --text-color: black;
      --border-color: #e0e0e0;
      --secondary-text-color: #525252;      
    }
    :host(.dark) {
      --background-color: black;
      --background-hover-color: rgba(255,255,255,0.06);
      --text-color: white;
      --border-color: #353535;
      --secondary-text-color: #a5a5a5;
    }
    .widget {
      background-color: var(--background-color);
      color: var(--text-color);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;
    }
    .widget-title {
      font-size: 16px;
      line-height: 24px;
      font-weight: bold;
      padding: 12px;
    }
    .job {
      display: block;
      color: inherit;
      font-size: 14px;
      line-height: 20px;
      text-decoration: none;
      padding: 12px;
      border-top: 1px solid var(--border-color);
    }
    .job:hover {
      background-color: var(--background-hover-color);
    }
    .job:focus {
      background-color: var(--background-hover-color);
      outline: none;
    }
    .job-title {
      font-weight: bold;
    }
    .job-company, .job-location {
      color: var(--secondary-text-color);
    }
    .job-company {
      display: flex;
      align-items: center;
      margin-top: 6px;
    }
    .job-company img {
      flex: none;
      border-radius: 3px;
      margin-right: 8px;
    }
    .job-location {
      display: flex;
      align-items: center;
      margin-top: 6px;
    }
    .job-location img {
      flex: none;
      margin-right: 8px;
    }
    .truncate {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .no-results {
      color: var(--secondary-text-color);
      font-size: 14px;
      line-height: 20px;
      padding: 12px;
      border-top: 1px solid var(--border-color);
    }
  `;

  static properties = {
    filters: { type: Object },
    data: { type: Object },
    theme: { type: String, reflect: true },
    title: { type: String, reflect: true }
  };

  constructor() {
    super();
    this.filters = {};
    this.data = null;
  } 

  firstUpdated() {
    this.fetchData();
  }

  updated(changedProperties) {
    if (changedProperties.has('filters')) {
      this.fetchData();
    }
    if (changedProperties.has('theme')) {
      this.updateTheme();
    }
  }

  updateTheme() {
    if (this.theme === 'dark') {
      this.shadowRoot.host.classList.add('dark');
    } else {
      this.shadowRoot.host.classList.remove('dark');
    }
  }

  async fetchData() {
    const apiKey = 'djlvNHlEejI3anF1dXRFWHNLWVNLSDFHR0JLUnNjeTJwTzZEdStOMWt3QT1UNWhNeyJmaWx0ZXJfYnkiOiJwdWJsaWM6dHJ1ZSIsICJpbmNsdWRlX2ZpZWxkcyI6ICJ0aXRsZSxqb2JDb21wYW55LHVybCxqb2JMb2NhdGlvbixqb2JSZW1vdGVMb2NhdGlvbixqb2JSZW1vdGVBdmFpbGFibGUiLCAibGltaXQiOiAiMTAiLCAib2Zmc2V0IjogMCwiZXhwaXJlc19hdCI6OTk5OTk5OTk5OX0';
    const query = '';
    const queryBy = 'title';

    let filters = [];
    if (this.filters.company) filters.push(`jobCompany.id:=${this.filters.company}`);
    if (this.filters.tag) filters.push(`jobTags.id:=["${this.filters.tag}"]`);
    const filterBy = filters.join("&&");

    const apiUrl = `https://search.reboundjobs.com/collections/jobs/documents/search?q=${encodeURIComponent(query)}&query_by=${encodeURIComponent(queryBy)}&filter_by=${encodeURIComponent(filterBy)}`;
  
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'X-TYPESENSE-API-KEY': apiKey,
        },
      });
  
      if (!response.ok) {
        console.error('Server returned an error');
        return;
      }
  
      const data = await response.json();
      this.data = data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  renderJob(job) {
    const flag = job.document.jobLocation && job.document.jobLocation[0] ? 
      twemoji.parse(job.document.jobLocation[0].flag, {
        folder: 'svg',
        ext: '.svg',
        attributes: () => {
          return {
            width: '18',
            height: '18'
          };
        }
      }) : null;
  
    const remote = job.document.jobRemoteAvailable;
    const remoteLocation = remote && job.document.jobRemoteLocation && job.document.jobRemoteLocation.length > 0 ? 
      job.document.jobRemoteLocation[0].title : 'Anywhere';
  
    const remoteFlag = twemoji.parse('🌎', {
      folder: 'svg',
      ext: '.svg',
      attributes: () => {
        return {
          width: '18',
          height: '18'
        };
      }
    });
  
    return html`
      <a target="_blank" rel="noopener" href="${job.document.url}" class="job">
        <div class="job-title">${job.document.title}</div>
        <div class="job-company">
          <img src="${job.document.jobCompany.companyLogo}" alt="${job.document.jobCompany.title}" width="18" height="18">
          <div class="truncate">${job.document.jobCompany.title}</div>
        </div>
        ${flag ? html`
        <div class="job-location">
          ${unsafeHTML(flag)}
          <div class="truncate">${job.document.jobLocation[0].title}</div>
        </div>` : ''}
        ${remote ? html`
        <div class="job-location">
          ${unsafeHTML(remoteFlag)}
          <span class="truncate">Remote (${remoteLocation})</span>
        </div>` : ''}
      </a>
    `;
  }  

  render() {
    if (this.data && this.data.hits.length > 0) {
      return html`
        <div class="widget">
          <div class="widget-title">${this.title || 'Sports Jobs'}</div>
          <div>${this.data.hits.map(job => this.renderJob(job))}</div>
        </div>
      `;
    } else if (this.data && this.data.hits.length === 0) {
      return html`
        <div class="widget">
          <div class="widget-title">${this.title || 'Sports Jobs'}</div>
          <div class="no-results">No jobs found</div>
        </div>
      `;
    }
    return html``;
  }  
}

if (!customElements.get('rebound-embed')) {
  customElements.define('rebound-embed', ReboundEmbed);
}

window.createWidget = function(elementId, filters) {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`No element found with id ${elementId}`);
  }

  const widget = document.createElement('rebound-embed');
  widget.filters = filters;
  
  const theme = element.getAttribute('data-theme');
  if (theme) {
    widget.setAttribute('theme', theme);
  }

  const title = element.getAttribute('data-title');
  if (title) {
    widget.setAttribute('title', title);
  }

  element.appendChild(widget);
}

window.addEventListener('DOMContentLoaded', (event) => {
  const element = document.getElementById('rebound-embed');
  if (!element) {
    console.warn('No div with id "rebound-embed" found, so no widget was created.');
    return;
  }

  const filters = JSON.parse(element.getAttribute('data-filter') || '{}');
  createWidget('rebound-embed', filters);
});

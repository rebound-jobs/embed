(function() {
  var apiKey = 'djlvNHlEejI3anF1dXRFWHNLWVNLSDFHR0JLUnNjeTJwTzZEdStOMWt3QT1UNWhNeyJmaWx0ZXJfYnkiOiJwdWJsaWM6dHJ1ZSIsICJpbmNsdWRlX2ZpZWxkcyI6ICJ0aXRsZSxqb2JDb21wYW55LHVybCxqb2JMb2NhdGlvbixqb2JSZW1vdGVMb2NhdGlvbixqb2JSZW1vdGVBdmFpbGFibGUiLCAibGltaXQiOiAiMTAiLCAib2Zmc2V0IjogMCwiZXhwaXJlc19hdCI6OTk5OTk5OTk5OX0';
  var query = '';
  var queryBy = 'title';
  var div = document.getElementById('rebound-embed');
  var filterValue = div.getAttribute('data-filter');
  var filterBy = filterValue ? `jobCompany.id:=${filterValue}` : '';
  var apiUrl = `https://search.reboundjobs.com/collections/jobs/documents/search?q=${encodeURIComponent(query)}&query_by=${encodeURIComponent(queryBy)}&filter_by=${encodeURIComponent(filterBy)}`;

  function fetchData() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', apiUrl, true);
    xhr.setRequestHeader('X-TYPESENSE-API-KEY', apiKey);
    xhr.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        var data = JSON.parse(this.response);
        displayData(data);
      } else {
        console.error('Server returned an error');
      }
    };
    xhr.onerror = function() {
      console.error('Connection error');
    };
    xhr.send();
  }

  function displayData(data) {
    var container = document.getElementById('rebound-embed');
    var jobsHtml = '';
    var title = 'Sports';
    if (data.found === 0) {
      jobsHtml = '<div class="rebound-p-3">No results found</div>';
    } else {
      jobsHtml = data.hits.map(function(job) {
        if (filterValue) {
          title = job.document.jobCompany.title;
        }
        return `
          <a target="_blank" rel="noopener" href="${job.document.url}" class="rebound-block hover:rebound-bg-slate-50 focus:rebound-bg-slate-50 focus:rebound-outline-none rebound-space-y-0.5 rebound-p-3">
            <div class="rebound-font-semibold">${job.document.title}</div>
            <div class="rebound-flex rebound-items-center">
              <img src="${job.document.jobCompany.companyLogo}" alt="${job.document.jobCompany.title}" class="rebound-flex-none rebound-w-4 rebound-h-4 rebound-rounded-full" />
              <div class="rebound-text-slate-600 rebound-truncate rebound-ml-1.5">${job.document.jobCompany.title}</div>
            </div>
            <div class="rebound-flex rebound-items-center">
              <div class="rebound-flex-none rebound-w-4 rebound-h-4">${job.document.jobLocation[0].flag}</div>
              <div class="rebound-text-slate-600 rebound-truncate rebound-ml-1.5">${job.document.jobLocation[0].title}</div>
            </div>
          </a>
        `;
      }).join('');
    }

    var widgetHtml = `
      <div class="rebound-bg-white rebound-font-sans rebound-text-black rebound-border rebound-border-slate-200 rebound-rounded-xl rebound-overflow-hidden">
        <div class="rebound-text-base rebound-font-semibold rebound-p-3">${title} Jobs</div>
        <div class="rebound-text-sm rebound-divide-y rebound-divide-slate-200 rebound-border-y rebound-border-slate-200">
          ${jobsHtml}
        </div>
        <a target="_blank" rel="noopener" href="https://reboundjobs.com" class="rebound-flex rebound-items-center rebound-justify-between hover:rebound-bg-slate-50 focus:rebound-bg-slate-50 focus:rebound-outline-none rebound-p-3">
          <div class="rebound-text-xs rebound-text-slate-500">Powered by ReboundJobs.com</div>
          <svg class="rebound-flex-none rebound-w-4 rebound-h-4 rebound-ml-3" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="m110 170 45-25 25.58 14.21c4.4-5.98 8.15-12.47 11.15-19.36L165 125V75l26.74-14.85c-3-6.89-6.75-13.38-11.15-19.36L155 55l-45-25V.5a100.085 100.085 0 0 0-20 0V30L45 55 19.42 40.79c-4.4 5.98-8.15 12.47-11.15 19.36L35 75v50L8.26 139.85c3 6.89 6.75 13.38 11.15 19.36L45 145l45 25v29.5a100.085 100.085 0 0 0 20 0zM55 99.11c0-24.85 20.15-45 45-45s45 20.15 45 45-20.15 45-45 45-45-20.14-45-45z" fill="none"></path><g fill="#585FFF"><path d="m165 125 26.74 14.85c5.31-12.21 8.26-25.69 8.26-39.85s-2.95-27.64-8.26-39.85L165 75zM35 75 8.26 60.15C2.95 72.36 0 85.83 0 100s2.95 27.64 8.26 39.85L35 125zm55-45V.5C61.06 3.37 35.76 18.58 19.42 40.79L45 55zm65 25 25.58-14.21C164.24 18.58 138.94 3.37 110 .5V30zM45 145l-25.58 14.21C35.76 181.42 61.06 196.63 90 199.5V170zm65 25v29.5c28.94-2.87 54.24-18.08 70.58-40.29L155 145z"></path><circle cx="100" cy="99.11" r="45"></circle></g></svg>
        </a>
      </div>
    `;

    container.innerHTML = widgetHtml;
  }

  fetchData();
})();

var link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://unpkg.com/rebound-embed/dist/embed.css';
document.head.appendChild(link);

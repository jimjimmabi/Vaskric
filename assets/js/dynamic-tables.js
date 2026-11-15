// assets/js/dynamic-tables.js

document.addEventListener('DOMContentLoaded', function() {
  const tableContainer = document.getElementById('dynamic-table-container');
  if (!tableContainer) return; // Stop if there's no container on the page

  // Get the category to filter by from the URL (e.g., ?category=Body)
  const urlParams = new URLSearchParams(window.location.search);
  const categoryFilter = urlParams.get('category');

  // Determine the dialect based on the URL path
  const isVaskoryo = window.location.pathname.includes('/vaskoryo/');
  const dialectName = isVaskoryo ? 'Vaskoryō' : 'Vaskric';

  const SUPABASE_URL = window.SUPABASE_URL;
  const SUPABASE_KEY = window.SUPABASE_KEY;

  async function fetchAndRenderTable() {
    try {
      // 1. Fetch data from Supabase
      let url = `${SUPABASE_URL}/rest/v1/lexicon?select=*`;
      if (categoryFilter) {
        url += `&category=eq.${encodeURIComponent(categoryFilter)}`;
      }

      const response = await fetch(url, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();

      if (data.length === 0) {
        tableContainer.innerHTML = `<p class="muted italic">No entries found for category: ${categoryFilter || 'All'}</p>`;
        return;
      }

      // 2. Build the Table based on the Dialect
      let html = '<table>';
      
      // Setup the Headers
      if (isVaskoryo) {
        // Vaskoryō headers
        html += `
          <thead>
            <tr>
              <th>Hangul</th>
              <th>IPA</th>
              <th>Meaning</th>
              <th>Etymology</th>
            </tr>
          </thead>
          <tbody>
        `;
      } else {
        // Vaskric headers
        html += `
          <thead>
            <tr>
              <th>Latin</th>
              <th>IPA</th>
              <th>Meaning</th>
              <th>Etymology</th>
            </tr>
          </thead>
          <tbody>
        `;
      }

      // 3. Populate the Rows
      data.forEach(item => {
        if (isVaskoryo) {
          // Vaskoryō row
          html += `
            <tr>
              <td class="vaskoryo-cell">${item.hangul}</td>
              <td class="ipa">${item.ipa}</td>
              <td>${item.meaning}</td>
              <td class="etymology">${item.etymology}</td>
            </tr>
          `;
        } else {
          // Vaskric row
          html += `
            <tr>
              <td><em>${item.latin}</em></td>
              <td class="ipa">${item.ipa}</td>
              <td>${item.meaning}</td>
              <td class="etymology">${item.etymology}</td>
            </tr>
          `;
        }
      });

      html += '</tbody></table>';
      tableContainer.innerHTML = html;

    } catch (error) {
      tableContainer.innerHTML = `<p style="color:red;">Error loading table: ${error.message}</p>`;
    }
  }

  fetchAndRenderTable();
});
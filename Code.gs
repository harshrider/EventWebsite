function doGet() {
  try {
    // Open the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    // Check if there's data
    if (data.length < 2) {
      return ContentService
        .createTextOutput(JSON.stringify({ error: 'No data found' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Extract headers
    const headers = data[0];
    const posts = [];
    
    // Convert rows to objects
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const post = {};
      
      // Map each column to a property
      post.id = i;
      post.title = row[0] || '';
      post.excerpt = row[1] || '';
      post.content = row[2] || '';
      post.category = row[3] || 'General';
      post.date = row[4] ? formatDate(row[4]) : new Date().toISOString().split('T')[0];
      post.author = row[5] || '23 Events Team';
      post.image = row[6] || '';
      post.readTime = row[7] || '5 min read';
      
      // Only add posts with titles
      if (post.title) {
        posts.push(post);
      }
    }
    
    // Return JSON response with CORS headers
    return ContentService
      .createTextOutput(JSON.stringify({ posts: posts }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error message
    return ContentService
      .createTextOutput(JSON.stringify({ 
        error: error.toString(),
        message: 'Failed to fetch blog posts'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function formatDate(date) {
  if (date instanceof Date) {
    return date.toISOString().split('T')[0];
  }
  return date.toString();
}


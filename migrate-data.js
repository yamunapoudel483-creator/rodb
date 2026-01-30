const sqlite3 = require('sqlite3').verbose();
const { createClient } = require('@libsql/client');

const localDb = new sqlite3.Database('/home/arcgg/rodb/server/data/rodb.db');
const tursoClient = createClient({
  url: 'libsql://rodb-ganeshpoudel.aws-ap-northeast-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Njk3NjgyMzMsImlkIjoiZmE5MzRjMWItMjI0ZC00NmY2LTliNDAtNzE3MzRhZTU1NmQ2IiwicmlkIjoiMDZhMjBkMDktNDFmYS00MTQyLTg1Y2EtZGQxYjMyZTA5YjNlIn0.UmhC7Ijvb9fG3fR8ftJJ0bxrYK_U58EN-_0BYM2s4woT6qjWDMIsH9yv7lml3zxbawnpIIsIjWhDb94GtSx9DQ',
});

async function migrate() {
  try {
    // Migrate articles
    const articles = await new Promise((resolve, reject) => {
      localDb.all('SELECT * FROM articles', (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });

    console.log(`Found ${articles.length} articles`);
    for (const article of articles) {
      const sql = `INSERT INTO articles (
        headline, sub_headline, summary, body, slug, featured_image_url,
        featured_image_caption, featured_image_alt, featured_image_credit,
        category_id, author_id, editor_id, status, is_breaking, is_pinned,
        is_featured, is_opinion, is_fact_checked, language, location_tag,
        source_attribution, seo_title, seo_description, reading_time,
        view_count, like_count, comment_count, published_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const values = [
        article.headline, article.sub_headline, article.summary, article.body, article.slug,
        article.featured_image_url, article.featured_image_caption, article.featured_image_alt,
        article.featured_image_credit, article.category_id, article.author_id, article.editor_id,
        article.status, article.is_breaking, article.is_pinned, article.is_featured,
        article.is_opinion, article.is_fact_checked, article.language, article.location_tag,
        article.source_attribution, article.seo_title, article.seo_description,
        article.reading_time, article.view_count, article.like_count, article.comment_count,
        article.published_at, article.created_at, article.updated_at
      ];

      await tursoClient.execute({ sql, args: values });
      console.log(`✅ Migrated: ${article.headline.substring(0, 50)}`);
    }

    console.log('\n✅ Data migration complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration error:', err.message);
    process.exit(1);
  }
}

migrate();

import { useEffect } from 'react';
import { Editor } from '@bigfatpanda1994/strapi-page-builder-react';
import '@bigfatpanda1994/strapi-page-builder-react/editor.css';

function App() {
  const config = {
    components: {},
    root: { fields: {} }
  };
  const strapi = {
    url: 'http://localhost:1337',
  };

  useEffect(() => {
    setTimeout(() => {
      window.postMessage({
        type: 'populate',
        data: {
          contentData: {},
          templateJson: { content: [], root: {}, zones: {} },
          isDefaultLocale: true,
          permissions: { read: true, edit: true, modify: true },
          locale: 'en',
          enforceTemplateShape: true
        }
      }, '*');
    }, 100);
  }, []);

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <h1>Test editor</h1>
      <Editor
        config={config}
        strapi={strapi}
      />
    </div>
  );
}

export default App;

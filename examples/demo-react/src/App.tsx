import { useEffect, useState } from 'react';
import { Editor, useApiKeyValidation } from '@bigfatpanda1994/strapi-page-builder-react';
import '@bigfatpanda1994/strapi-page-builder-react/editor.css';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [validateApiKey, setValidateApiKey] = useState(false);
  const [strapiUrl, setStrapiUrl] = useState('http://localhost:1337');

  const config = {
    components: {},
    root: { fields: {} }
  };

  const strapi = {
    url: strapiUrl,
  };

  // Optional: Use the hook directly to show status outside the editor
  const validation = useApiKeyValidation(
    validateApiKey ? apiKey : undefined,
    validateApiKey ? strapiUrl : undefined
  );

  useEffect(() => {
    // Simulate Strapi sending initial data
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
    }, 500);
  }, []);

  return (
    <div style={{ flex: 1, position: 'relative' }}>
      <Editor
        config={config}
        strapi={strapi}
        apiKey={apiKey}
        validateApiKey={validateApiKey}
      />
    </div>
  );
}

export default App;

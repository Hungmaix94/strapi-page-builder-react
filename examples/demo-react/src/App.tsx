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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
      <div style={{
        padding: '1rem',
        borderBottom: '1px solid #ccc',
        background: '#f5f5f5',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <h2 style={{ margin: 0, marginRight: '1rem' }}>Page Builder Demo</h2>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Strapi URL</label>
          <input
            type="text"
            value={strapiUrl}
            onChange={(e) => setStrapiUrl(e.target.value)}
            style={{ padding: '0.25rem', width: '200px' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>API Key</label>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter API Key"
            style={{ padding: '0.25rem', width: '250px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={validateApiKey}
              onChange={(e) => setValidateApiKey(e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            Enable Validation
          </label>
        </div>

        {validateApiKey && (
          <div style={{
            marginLeft: 'auto',
            padding: '0.5rem',
            borderRadius: '4px',
            background: validation.loading ? '#e0e0e0' : validation.isValid ? '#d4edda' : '#f8d7da',
            color: validation.loading ? '#333' : validation.isValid ? '#155724' : '#721c24',
            fontSize: '0.9rem'
          }}>
            {validation.loading ? 'Validating...' : validation.isValid ? 'Valid API Key' : 'Invalid API Key'}
          </div>
        )}
      </div>

      <div style={{ flex: 1, position: 'relative' }}>
        <Editor
          config={config}
          strapi={strapi}
          apiKey={apiKey}
          validateApiKey={validateApiKey}
        />
      </div>
    </div>
  );
}

export default App;

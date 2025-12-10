import { Editor } from '@bigfatpanda1994/strapi-page-builder-react';
import '@bigfatpanda1994/strapi-page-builder-react/editor.css';

function App() {
  const config = {
    components: {},
    root: { fields: {} }
  };
  const strapi = {
    url: 'http://localhost:1337',
    authToken: 'test-token'
  };

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <h1>Test editor</h1>
      <Editor
        config={config}
        strapi={strapi}
        initialData={{ content: [], root: {}, zones: {} }}
        initialPermissions={{ read: true, edit: true, modify: true }}
      />
    </div>
  );
}

export default App;

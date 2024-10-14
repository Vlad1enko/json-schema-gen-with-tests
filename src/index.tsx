import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { SchemaService } from './services/SchemaService';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const schemaService = new (SchemaService as any)();

root.render(
    <React.StrictMode>
        <App schemaService={schemaService} />
    </React.StrictMode>
);

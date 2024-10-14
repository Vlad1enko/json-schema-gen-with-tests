import { useState } from 'react';
import type { ISchemaService } from './services/SchemaService';
import './App.css';

function App({ schemaService }: { schemaService: ISchemaService }) {
    const [schema, setSchema] = useState('');
    const [result, setResult] = useState({});
    const [error, setError] = useState('');

    const onFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = schemaService.generateObjectFromJsonSchema(schema);
            setResult(result);
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="app">
            <div className="wrapper">
                <form onSubmit={onFormSubmit}>
                    <textarea
                        name="schema"
                        className="textarea"
                        value={schema}
                        onChange={(e) => setSchema(e.target.value)}
                    ></textarea>
                    <button type="submit" className="btn">
                        Get an object based on schema
                    </button>
                </form>
                <div>
                    <h2>Result:</h2>
                    <code>
                        <pre>{JSON.stringify(result, null, 2)}</pre>
                    </code>
                </div>
                {error && (
                    <div className="error">
                        <h3>An error occured:</h3>
                        <p>{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;

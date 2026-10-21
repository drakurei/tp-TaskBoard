import { Form } from 'react-bootstrap'
import ErrorMessage from './ErrorMessage'

export default function TaskTextarea({ label, name, value, onChange, error, placeholder, rows = 4 }) {
    return (
        <Form.Group className='mb-3' controlId={name}>
            <Form.Label>{label}</Form.Label>
            <Form.Control
                as='textarea'
                rows={rows}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                isInvalid={!!error}
            />
            <ErrorMessage message={error} />
        </Form.Group>
    )
}

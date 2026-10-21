import { Form } from 'react-bootstrap'
import ErrorMessage from './ErrorMessage'

export default function TaskInput({ label, name, value, onChange, error, placeholder, type = 'text', min }) {
    return (
        <Form.Group className='mb-3' controlId={name}>
            <Form.Label>{label}</Form.Label>
            <Form.Control
                type={type}
                name={name}
                placeholder={placeholder}
                min={min}
                value={value}
                onChange={onChange}
                isInvalid={!!error}
            />
            <ErrorMessage message={error} />
        </Form.Group>
    )
}

import { Form } from 'react-bootstrap'
import ErrorMessage from './ErrorMessage'

export default function TaskSelect({ label, name, value, onChange, options, error }) {
    return (
        <Form.Group className='mb-3' controlId={name}>
            <Form.Label>{label}</Form.Label>
            <Form.Select
                name={name}
                value={value}
                onChange={onChange}
                isInvalid={!!error}
            >
                { options.map((option) => (
                    <option key={option.value} value={option.value}>
                        { option.label }
                    </option>
                )) }
            </Form.Select>
            <ErrorMessage message={error} />
        </Form.Group>
    )
}

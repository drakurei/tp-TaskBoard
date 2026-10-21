import { Form } from 'react-bootstrap'
import ErrorMessage from './ErrorMessage'

export default function TaskCheckbox({ label, name, checked, onChange, error }) {
    return (
        <Form.Group className='mb-3'>
            <Form.Check
                type='checkbox'
                id={name}
                label={label}
                name={name}
                checked={checked}
                onChange={onChange}
                isInvalid={!!error}
            />
            <ErrorMessage message={error} />
        </Form.Group>
    )
}

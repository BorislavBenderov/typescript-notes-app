import { Form, Stack, Row, Col, Button } from 'react-bootstrap';
import CreatableSelect from 'react-select/creatable';
import { Link } from 'react-router-dom';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NoteData, Tag } from '../App';
import { v4 as uuidV4 } from 'uuid';

type NoteFormProps = {
    onSubmit: (data: NoteData) => void
    onAddTag: (tag: Tag) => void
    availableTags: Tag[]
} & Partial<NoteData>

export const NoteForm = ({ onSubmit, onAddTag, availableTags, title='', markdown = '', tags = [] }: NoteFormProps) => {
    const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);
    const titleRef = useRef<HTMLInputElement>(null);
    const markdownRef = useRef<HTMLTextAreaElement>(null);
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        onSubmit({
            title: titleRef.current!.value,
            markdown: markdownRef.current!.value,
            tags: []
        })

        navigate('..');
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Stack gap={4}>
                <Row>
                    <Col>
                        <Form.Group controlId='title'>
                            <Form.Label>Title</Form.Label>
                            <Form.Control ref={titleRef} required defaultValue={title}/>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId='tags'>
                            <Form.Label>Tags</Form.Label>
                            <CreatableSelect
                                onCreateOption={label => {
                                    const newTag = { id: uuidV4(), label }
                                    onAddTag(newTag)
                                    setSelectedTags(prev => [...prev, newTag])
                                }}
                                value={selectedTags.map(tag => {
                                    return { label: tag.label, value: tag.id }
                                })}
                                options={availableTags.map(tag => {
                                    return { label: tag.label, value: tag.id }
                                })}
                                onChange={tags => {
                                    setSelectedTags(tags.map(tag => {
                                        return { label: tag.label, id: tag.value }
                                    }))
                                }}
                                isMulti />
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group controlId='markdown'>
                    <Form.Label>Body</Form.Label>
                    <Form.Control defaultValue={markdown} required as='textarea' ref={markdownRef} rows={15} />
                </Form.Group>
                <Stack direction='horizontal' gap={2} className='justify-content-end'>
                    <Button type='submit' variant='primary'>
                        Save
                    </Button>
                    <Link to='..'>
                        <Button type='button' variant='outline-secondary'>
                            Cancel
                        </Button>
                    </Link>
                </Stack>
            </Stack>
        </Form>
    );
}
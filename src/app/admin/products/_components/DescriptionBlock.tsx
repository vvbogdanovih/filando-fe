'use client'

import 'react-quill-new/dist/quill.snow.css'
import dynamic from 'next/dynamic'
import type { MutableRefObject } from 'react'
import type ReactQuill from 'react-quill-new'

type UnprivilegedEditor = ReactQuill.UnprivilegedEditor

// SSR-safe dynamic import of Quill
const QuillEditor = dynamic(() => import('react-quill-new'), { ssr: false })

const TOOLBAR_OPTIONS = [
	[{ header: [2, 3, false] }],
	['bold', 'italic', 'underline'],
	[{ list: 'ordered' }, { list: 'bullet' }],
	['link'],
	['clean']
]

export interface DescriptionValue {
	html: string
	json: object
}

interface DescriptionBlockProps {
	// A ref the parent can read on submit; DescriptionBlock writes to it on every change
	descriptionRef: MutableRefObject<DescriptionValue | null>
}

export const DescriptionBlock = ({ descriptionRef }: DescriptionBlockProps) => {
	const handleChange = (html: string, _delta: unknown, _source: unknown, editor: UnprivilegedEditor) => {
		descriptionRef.current = { html, json: editor.getContents() as object }
	}

	return (
		<section className='flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-6'>
			<h2 className='text-sm font-semibold text-gray-900'>Опис</h2>
			<QuillEditor
				theme='snow'
				placeholder='Введіть опис продукту...'
				modules={{ toolbar: TOOLBAR_OPTIONS }}
				onChange={handleChange}
				className='rounded-md'
			/>
		</section>
	)
}

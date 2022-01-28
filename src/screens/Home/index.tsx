import { ShareIcon } from "@heroicons/react/solid"
import React from "react"
import { GithubPicker } from "react-color"

import { useLocalStorage, useDebounce, useBoolean, useMedia } from "react-use"

import { Buffer } from "buffer"
import { Viewer } from "../../components/Viewer"

const defaultContent = `# Introduction to Doc creator


## What is Doc Creator?
Doc creator is a highly opinionated tool that helps you create documentation based on markdown.


## How to use Doc Creator?
As you type markdown in the editor you will see a live preview of the doc being created on the right side. Once you are happy with the doc you can hit the preview and share button, which will take you to the final doc. From there you can just share the URL with anyone who needs to see the content. 

You can use almost any markdown syntax to create your documentation, such as: 

### Lists

* Item 1
* Item 2
* Item 3

### Tables 
|Header1 |Header2  | Header3|
--- | --- | ---|
|data1|data2|data3|
|data11|data12|data13|

### Links
[Github](https://github.com)

[Canvas Creator](https://github.com)

[Apple](https://apple.com)

### Images

![Alt text](http://placeholder.pics/svg/300 "a title")



### Headings

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5


`

function Home() {
	const [value, setValue, remove] = useLocalStorage("content", "")
	const [showImportUrl, toggleInput] = useBoolean(false)
	const [content, setContent] = React.useState(value || defaultContent)
	const [bgColor, setBgColor] = React.useState("")
	const [showColorPicker, setShowColorPicker] = React.useState(false)
	const isLg = useMedia("(min-width: 1024px)")

	useDebounce(
		() => {
			setValue(content)
		},
		1000,
		[content]
	)

	const encode = (value: string) => Buffer.from(value).toString("base64")

	const processURLForContent = (url: string) => {
		// Get the content from the url search params

		const encodedContent = url.split("content=")[1]

		if (encodedContent) {
			// Decode the base64 encoded content
			const decodedString = Buffer.from(encodedContent, "base64").toString()
			setContent(decodedString)
		}
	}

	const onCopyLink = () => {
		// base 64 encode the content
		const encodedString = encode(content)

		if (navigator.clipboard) {
			// copy the content to clipboard
			navigator.clipboard.writeText(encodedString)
		}
		// url encode the background color
		const encodedBgColor = encode(bgColor)

		// open a new tap to the new page
		const url = `/doc?content=${encodedString}&bgColor=${encodedBgColor}`

		window.open(url, "_blank")
	}

	return (
		<div className='flex flex-col w-full min-h-screen lg:flex-row '>
			<div className='w-full h-full p-2 md:p-8 lg:w-1/2 lg:prose-xl'>
				<div className='prose'>
					<h1>MD Document Creator</h1>
					<p className='text-lg text-gray-800 '>
						Write markdown and get a beautiful doc that you can share with
						anyone. Your content is encoded directly in the URL, which means it
						never touches any server, and you can share it with anyone without
						the need for any accounts with just a simple (but admittedly long)
						URL.
					</p>
				</div>
				<div className='mt-4 mb-4 flex justify-between'>
					<button
						onClick={() => {
							setContent("")
							remove()
						}}
						className='py-4 px-2 rounded text-sm bg-slate-50 hover:bg-slate-100 font-bold'
					>
						Clear content
					</button>

					<button
						onClick={() => {
							toggleInput()
						}}
						className='py-4 px-2 rounded text-sm bg-slate-50 hover:bg-slate-100 font-bold'
					>
						Import from URL
					</button>
				</div>
				{showImportUrl && (
					<input
						onChange={(e) => {
							processURLForContent(e.target.value)
						}}
						placeholder='https://content-creator.co.uk'
						type='url'
						className='w-full p-2 rounded mb-4'
					/>
				)}

				<label htmlFor='content' className='hidden'>
					Content
				</label>
				<textarea
					rows={isLg ? 30 : 20}
					onFocus={() => {
						if (content === defaultContent) {
							setContent("")
						}
					}}
					value={content}
					id='content'
					onChange={(e) => {
						setContent(e.target.value)
					}}
					className='w-full h-full-screen p-2 rounded grow bg-slate-800 text-slate-100'
				/>
			</div>

			<div
				className='p-8 grow lg:w-1/2 bg-slate-100'
				style={{ background: bgColor }}
			>
				<div className='flex justify-between '>
					<div>
						<button
							onClick={() => setShowColorPicker((v) => !v)}
							className='py-4 px-3 bg-transparent mb-2 rounded max-h-14 text-gray-600 font-semibold'
						>
							Change background color
						</button>
						{showColorPicker && (
							<GithubPicker
								onChange={(color) => {
									setBgColor(color.hex)
									setShowColorPicker(false)
								}}
								colors={[
									"#f1f5f9",
									"#cbd5e1",
									"#94a3b8",
									"#fef2f2",
									"#fee2e2",
									"#fecaca",
									"#fff7ed",
									"#ffedd5",
									"#fed7aa",
								]}
							/>
						)}
					</div>
					<button
						onClick={onCopyLink}
						className='flex max-h-14 items-center justify-center w-1/4 max-w-sm px-2 py-4 text-sm font-bold transition-all rounded shadow bg-blue-300 hover:bg-blue-200 hover:text-blue-800 text-blue-900'
					>
						<ShareIcon className='w-4 mr-2 hover:animate-pulse' />
						Preview & Share
					</button>
				</div>
				<div className='mt-8 prose text-slate-800 '>
					<Viewer content={content} />
				</div>
			</div>
		</div>
	)
}

export default Home

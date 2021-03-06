import { Buffer } from "buffer"
import * as React from "react"
import ReactMarkdown from "react-markdown"
import { useSearchParams } from "react-router-dom"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism"
import remarkGfm from "remark-gfm"
import { Viewer } from "../../components/Viewer"

interface DocScreenProps {}

const DocScreen: React.FunctionComponent<DocScreenProps> = () => {
	let [searchParams] = useSearchParams()

	const encodedContent = searchParams.get("content") ?? ""
	const bgColorURL = searchParams.get("bgColor") ?? ""
	const [content, setContent] = React.useState<string>("")
	const [bgColor, setBgColor] = React.useState<string>("")

	React.useEffect(() => {
		if (encodedContent.length > 1) {
			// base 64 decode the content
			const decodedString = Buffer.from(encodedContent, "base64").toString()
			setContent(decodedString)
		}
	}, [encodedContent])

	React.useEffect(() => {
		if (bgColorURL.length > 1) {
			//  bse 64 decode the background color
			const decodedBgColor = Buffer.from(bgColorURL, "base64").toString()

			setBgColor(decodedBgColor)
		}
	}, [bgColorURL])

	return (
		<div className='flex justify-center min-h-screen bg-slate-50'>
			<div
				className='container max-w-5xl px-8 py-16 mt-0 prose bg-gray-200 md:prose-lg xl:rounded-xl xl:mt-8 xl:shadow-xl xl:prose-xl text-slate-800'
				style={{ background: bgColor }}
			>
				<div className='xl:mt-2'>
					<Viewer content={content} />
				</div>
			</div>
		</div>
	)
}

export default DocScreen

import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism"
import remarkGfm from "remark-gfm"

type ViewerProps = {
	content: string
}

export const Viewer = (props: ViewerProps) => {
	return (
		<ReactMarkdown
			remarkPlugins={[remarkGfm]}
			children={props.content}
			components={{
				code({ node, inline, className, children, ...props }) {
					const match = /language-(\w+)/.exec(className || "")
					return !inline && match ? (
						<SyntaxHighlighter
							children={String(children).replace(/\n$/, "")}
							style={dark}
							language={match[1]}
							PreTag='div'
							{...props}
						/>
					) : (
						<code className={`bg-transparent`} {...props}>
							{children}
						</code>
					)
				},
			}}
		/>
	)
}

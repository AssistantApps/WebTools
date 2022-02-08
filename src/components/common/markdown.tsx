import React from 'react';
import Markdown from 'markdown-to-jsx';

interface IProps {
    markdown: string;
}

export const MarkdownRenderer: React.FC<IProps> = (props: IProps) => {
    return (
        <Markdown>
            {props.markdown}
        </Markdown>
    );
}
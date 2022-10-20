import * as React from "react";
// import { withRouter } from "wouter";

interface IProps {
    location: any;
    children: React.ReactNode;
}

class ScrollToTopWithoutRoute extends React.Component<IProps> {
    componentDidUpdate(prevProps: IProps) {
        if (this.props.location !== prevProps.location) {
            window.scrollTo(0, 0)
        }
    }

    render() {
        return this.props.children
    }
}

// export const ScrollToTop = withRouter((props: IProps) => <ScrollToTopWithoutRoute {...props} />)
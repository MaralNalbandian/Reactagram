import React from 'react';

import { PaginationItem, PaginationLink } from 'reactstrap';

class Page extends React.Component {
    render() {
        if (this.props.page === this.props.currentPage){
            return (
                <PaginationItem active>
                    <PaginationLink href={`/${this.props.page}`}>
                        {this.props.page}
                    </PaginationLink>
                </PaginationItem>
            )
        } else {
            return (
                <PaginationItem>
                    <PaginationLink href={`/${this.props.page}`}>
                        {this.props.page}
                    </PaginationLink>
                </PaginationItem>
            )
        }
    }
}

export default Page;
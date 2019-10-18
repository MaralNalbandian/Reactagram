import React from 'react';

import { PaginationItem, PaginationLink } from 'reactstrap';

class Page extends React.Component {
    render() {
        if (this.props.pageNum === this.props.currentPage){
            return (
                <PaginationItem active>
                    <PaginationLink href={this.props.page}>
                        {this.props.pageNum}
                    </PaginationLink>
                </PaginationItem>
            )
        } else {
            return (
                <PaginationItem>
                    <PaginationLink href={this.props.page}>
                        {this.props.pageNum}
                    </PaginationLink>
                </PaginationItem>
            )
        }
    }
}

export default Page;
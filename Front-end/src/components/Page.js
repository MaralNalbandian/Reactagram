// Page component - The Page component is used to make the pagination dynamic and display as many 
// pages as there are posts
// Author(s) - Brendon
// Date - 18/10/19

import React from 'react';
import { PaginationItem, PaginationLink } from 'reactstrap';

class Page extends React.Component {
    render() {
        //Highlights the current page the user is on
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
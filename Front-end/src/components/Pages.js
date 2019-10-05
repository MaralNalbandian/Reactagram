import React from 'react';

import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

import Page from './Page'

class Pages extends React.Component {
    render() {
        var previous =''
        if (this.props.currentPage === 1){
            previous = '/1'
        } else {
            previous = `/${Number(this.props.currentPage)-1}`
        }
        return (
            <Pagination className="Pages" aria-label="Page navigation example">
                <PaginationItem>
                    <PaginationLink first href="/1" />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink previous href={previous} />
                </PaginationItem>

                {Object.keys(this.props.pages).map(key => (
                    <Page 
                        key={key}
                        page= {Number(key)+1}
                        currentPage = {Number(this.props.currentPage)}
                    />
                ))}
                
                <PaginationItem>
                    <PaginationLink next href={`/${Number(this.props.currentPage)+1}`} />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink last href={`/${Number(this.props.lastPage)}`} />
                </PaginationItem>
            </Pagination>
        )
    }
}

export default Pages;
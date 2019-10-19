// Pages component - The Pages component renders a bar that allows the user to navigate between pages.
// This component needs to be dynamic and change when the number of posts increases/decreases.
// Author(s) - Brendon
// Date - 18/10/19

import React from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

import Page from './Page'

class Pages extends React.Component {
    render() {
        var previous = ''
        var nextPage = ''
        if (this.props.postId){
            //If the current page is the first page, make the previous button reload the page
            if (this.props.currentPage == 1){
                previous = `/view/${this.props.postId}/1`;
            } else {
                previous = `/view/${this.props.postId}/${Number(this.props.currentPage)-1}`;
            }
            //If the current page is the last page, make the next button reload the page
            if (this.props.currentPage == this.props.lastPage){
                nextPage = this.props.lastPage
            } else {
                nextPage = Number(this.props.currentPage) + 1
            }
            return(
                <Pagination className="Pages" aria-label="Page navigation example">
                    {/* First page button */}
                    <PaginationItem>
                        <PaginationLink first href={`/view/${this.props.postId}/1`} />
                    </PaginationItem>
                    {/* Previous page button */}
                    <PaginationItem>
                        <PaginationLink previous href={previous} />
                    </PaginationItem>

                    {/* Lists all page numbers */}
                    {Object.keys(this.props.pages).map(key => (
                        
                        <Page 
                            key={key}
                            page= {`/view/${this.props.postId}/${Number(key)+1}`}
                            pageNum={Number(key)+1}
                            currentPage = {Number(this.props.currentPage)}
                        />
                    ))}
                    
                    {/* Next page button */}
                    <PaginationItem>
                        <PaginationLink next href={`/view/${this.props.postId}/${nextPage}`} />
                    </PaginationItem>
                    {/* Final page button */}
                    <PaginationItem>
                        <PaginationLink last href={`/view/${this.props.postId}/${Number(this.props.lastPage)}`} />
                    </PaginationItem>
                </Pagination>
            )
        } else {
            if (this.props.currentPage == 1){
                previous = `/1`;
            } else {
                previous = `/${Number(this.props.currentPage)-1}`;
            }
            if (this.props.currentPage == this.props.lastPage){
                nextPage = this.props.lastPage
            } else {
                nextPage = Number(this.props.currentPage) + 1
            }
            return (
                <Pagination className="Pages" aria-label="Page navigation example">
                    <PaginationItem>
                        <PaginationLink first href={`/1`} />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink previous href={previous} />
                    </PaginationItem>

                    {Object.keys(this.props.pages).map(key => (
                        
                        <Page 
                            key={key}
                            page= {'/' + (Number(key)+1)}
                            pageNum={Number(key)+1}
                            currentPage = {Number(this.props.currentPage)}
                        />
                    ))}
                    
                    <PaginationItem>
                        <PaginationLink next href={`/${nextPage}`} />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink last href={`/${Number(this.props.lastPage)}`} />
                    </PaginationItem>
                </Pagination>
            )
        }
    }
}

export default Pages;
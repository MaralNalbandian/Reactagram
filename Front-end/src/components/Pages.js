import React from 'react';

import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

import Page from './Page'

class Pages extends React.Component {
    render() {
        var previous = ''
        var nextPage = ''
        if (this.props.postId){
            if (this.props.currentPage == 1){
                previous = `/view/${this.props.postId}/1`;
            } else {
                previous = `/view/${this.props.postId}/${Number(this.props.currentPage)-1}`;
            }
            if (this.props.currentPage == this.props.lastPage){
                nextPage = this.props.lastPage
            } else {
                nextPage = Number(this.props.currentPage) + 1
            }
            return(
                <Pagination className="Pages" aria-label="Page navigation example">
                    <PaginationItem>
                        <PaginationLink first href={`/view/${this.props.postId}/1`} />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink previous href={previous} />
                    </PaginationItem>

                    {Object.keys(this.props.pages).map(key => (
                        
                        <Page 
                            key={key}
                            page= {`/view/${this.props.postId}/${Number(key)+1}`}
                            pageNum={Number(key)+1}
                            currentPage = {Number(this.props.currentPage)}
                        />
                    ))}
                    
                    <PaginationItem>
                        <PaginationLink next href={`/view/${this.props.postId}/${nextPage}`} />
                    </PaginationItem>
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
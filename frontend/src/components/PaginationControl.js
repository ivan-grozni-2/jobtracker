import React from 'react';

export default function PaginationControl(thePage) {

    return (
        <div className='pagination'>
            <button disabled={thePage.page <= 1} onClick={() => thePage.onChange(thePage.page - 1)}>
                ◄ Prev
            </button>

            <span> Page {thePage.page} of {thePage.totalPages} </span>

            <button disabled={thePage.page >= thePage.totalPages} onClick={() => thePage.onChange(thePage.page + 1)}>
                ► Next
            </button>
        </div>
    )
}
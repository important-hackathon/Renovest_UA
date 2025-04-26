'use client';

import ReactPaginate from 'react-paginate';

interface PaginationProps {
    pageCount: number;
    onPageChange: (data: { selected: number }) => void;
}

export default function Pagination({ pageCount, onPageChange }: PaginationProps) {
    return (
        <div className="flex flex-col items-center mt-10">
            <ReactPaginate
                previousLabel="←"
                nextLabel="→"
                breakLabel="..."
                onPageChange={onPageChange}
                pageRangeDisplayed={2}
                marginPagesDisplayed={1}
                pageCount={pageCount}
                containerClassName="flex items-center space-x-2 text-sm"
                activeClassName="rounded-full px-3 py-1"
                pageClassName="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 cursor-pointer"
                previousClassName="w-10 h-10 text-lg flex items-center justify-center cursor-pointer"
                nextClassName="w-10 h-10 text-lgp flex items-center justify-center cursor-pointer"
                breakClassName="px-3 py-1 text-gray-500"
            />

            <div className="mt-6 w-24 h-1 rounded-full bg-blue-500 mx-auto" />
            <div className="w-24 h-1 rounded-full bg-green-400 mx-auto mt-1" />
        </div>
    );
}

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function OpportunitiesPagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  totalItems,
  itemsPerPage 
}) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl" style={{ background: '#fff', border: '1px solid #000' }}>
      <div className="text-sm" style={{ color: '#666' }}>
        Showing <span style={{ color: '#000', fontWeight: 600 }}>{startItem}</span> to{' '}
        <span style={{ color: '#000', fontWeight: 600 }}>{endItem}</span> of{' '}
        <span style={{ color: '#000', fontWeight: 600 }}>{totalItems}</span> opportunities
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
          className="rounded-lg"
          style={{ 
            background: currentPage === 1 ? '#F3F4F6' : '#fff',
            color: currentPage === 1 ? '#9CA3AF' : '#000',
            border: '1px solid #000'
          }}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-2" style={{ color: '#666' }}>...</span>
          ) : (
            <Button
              key={page}
              onClick={() => onPageChange(page)}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              className="rounded-lg min-w-[40px]"
              style={{
                background: currentPage === page ? '#D8A11F' : '#fff',
                color: currentPage === page ? '#fff' : '#000',
                border: '1px solid ' + (currentPage === page ? '#D8A11F' : '#000')
              }}
            >
              {page}
            </Button>
          )
        ))}

        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
          className="rounded-lg"
          style={{ 
            background: currentPage === totalPages ? '#F3F4F6' : '#fff',
            color: currentPage === totalPages ? '#9CA3AF' : '#000',
            border: '1px solid #000'
          }}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
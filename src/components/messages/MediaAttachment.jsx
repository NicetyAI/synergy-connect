import React, { useState } from "react";
import { X } from "lucide-react";

function isVideo(url) {
  return /\.(mp4|webm|mov|avi|mkv)(\?|$)/i.test(url);
}

export function MediaPreview({ urls }) {
  const [lightboxUrl, setLightboxUrl] = useState(null);

  if (!urls || urls.length === 0) return null;

  return (
    <>
      <div className={`flex flex-wrap gap-1.5 mt-1.5 ${urls.length === 1 ? '' : 'grid grid-cols-2'}`}>
        {urls.map((url, i) => (
          isVideo(url) ? (
            <video
              key={i}
              src={url}
              controls
              className="rounded-lg max-w-full max-h-48 object-cover"
              style={{ minWidth: 120 }}
            />
          ) : (
            <img
              key={i}
              src={url}
              alt="Attachment"
              className="rounded-lg max-h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
              style={{ minWidth: 80 }}
              onClick={() => setLightboxUrl(url)}
            />
          )
        ))}
      </div>

      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <button className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors" onClick={() => setLightboxUrl(null)}>
            <X className="w-6 h-6 text-white" />
          </button>
          <img src={lightboxUrl} alt="Full size" className="max-w-full max-h-full object-contain rounded-lg" />
        </div>
      )}
    </>
  );
}

export function FilePreviewBar({ files, onRemove }) {
  if (!files || files.length === 0) return null;

  return (
    <div className="flex gap-2 px-2 py-1.5 overflow-x-auto">
      {files.map((file, i) => (
        <div key={i} className="relative flex-shrink-0">
          {file.type?.startsWith('video/') ? (
            <video src={URL.createObjectURL(file)} className="h-16 w-16 object-cover rounded-lg" />
          ) : (
            <img src={URL.createObjectURL(file)} alt="Preview" className="h-16 w-16 object-cover rounded-lg" />
          )}
          <button
            onClick={() => onRemove(i)}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: '#EF4444' }}
          >
            <X className="w-3 h-3 text-white" />
          </button>
        </div>
      ))}
    </div>
  );
}
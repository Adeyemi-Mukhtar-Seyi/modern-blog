import React, { useState } from 'react';

type MediaRendererProps = {
  mediaType?: string;
  mediaUrl?: string;
  title: string;
};



const MediaRenderer = ({
  mediaType,
  mediaUrl,
  title,
}: MediaRendererProps) => {

  const [imageLoading, setImageLoading] =
    useState(true);

  const [imageError, setImageError] =
    useState(false);



  if (!mediaUrl || !mediaType) {
    return null;
  }



  // IMAGE
  if (mediaType === 'image') {

    return (

      <div className="relative w-full overflow-hidden rounded-t-lg bg-gray-100 aspect-video">

        {/* SKELETON */}
        {imageLoading && !imageError && (

          <div className="absolute inset-0 animate-pulse bg-gray-300" />

        )}

        {/* IMAGE ERROR */}
        {imageError ? (

          <div className="flex items-center justify-center h-full text-gray-500 text-sm">

            Failed to load image

          </div>

        ) : (

          <img
            src={mediaUrl}
            alt={title}
            loading="lazy"
            decoding="async"
            onLoad={() =>
              setImageLoading(false)
            }
            onError={() => {
              setImageLoading(false);
              setImageError(true);
            }}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoading
                ? 'opacity-0'
                : 'opacity-100'
            }`}
          />

        )}

      </div>
    );
  }



  // VIDEO
  if (mediaType === 'video') {

    return (

      <div className="w-full overflow-hidden rounded-t-lg bg-black aspect-video">

        <video
          src={mediaUrl}
          controls
          preload="metadata"
          className="w-full h-full"
        >
          Your browser does not support the video tag.
        </video>

      </div>
    );
  }



  // AUDIO
  if (mediaType === 'audio') {

    return (

      <div className="w-full bg-gray-100 rounded-t-lg flex items-center justify-center p-4">

        <audio
          controls
          preload="none"
          className="w-full max-w-md"
        >

          <source
            src={mediaUrl}
            type="audio/mpeg"
          />

          Your browser does not support the audio element.

        </audio>

      </div>
    );
  }



  return null;
};

export default React.memo(
  MediaRenderer
);
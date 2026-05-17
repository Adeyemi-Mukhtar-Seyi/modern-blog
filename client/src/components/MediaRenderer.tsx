import React from 'react';

type MediaRendererProps = {
  mediaType?: string;
  mediaUrl?: string;
  title: string;
};

const MediaRenderer = ({ mediaType, mediaUrl, title }: MediaRendererProps) => {
  if (!mediaUrl || !mediaType) return null; // ✅ safeguard if media is missing

  if (mediaType === 'image') {
    return (
      <img
        src={mediaUrl}
        alt={title}
        className="w-full h-64 object-cover rounded-t-lg"
      />
    );
  }

  if (mediaType === 'video') {
    return (
      <video
        src={mediaUrl}
        controls
        className="w-full h-64 rounded-t-lg"
      >
        Your browser does not support the video tag.
      </video>
    );
  }

  if (mediaType === 'audio') {
    return (
      <div className="w-full bg-gray-100 rounded-t-lg flex items-center justify-center p-4">
        <audio controls className="w-full max-w-md">
          <source src={mediaUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  }

  return null;
};

export default MediaRenderer;











// import React from 'react';

// const MediaRenderer = ({ mediaType, mediaUrl, title }) => {
//   if (mediaType === 'image') {
//     return <img src={mediaUrl} alt={title} className="w-full h-48 object-cover rounded-t-lg" />;
//   } else if (mediaType === 'video') {
//     return (
//       <video src={mediaUrl} controls className="w-full h-48 object-cover rounded-t-lg">
//         Your browser does not support the video tag.
//       </video>
//     );
//   } else if (mediaType === 'audio') {
//     return (
//       <div className="w-full h-48 bg-black rounded-t-lg flex items-center justify-center">
//         <audio controls className="w-full max-w-md">
//           <source src={mediaUrl} type="audio/mpeg" />
//           Your browser does not support the audio element.
//         </audio>
//       </div>
//     );
//   }
//   return null;
// };

// export default MediaRenderer;

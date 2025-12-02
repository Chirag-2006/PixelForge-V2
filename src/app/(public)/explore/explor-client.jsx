// "use client";

// import { getPublicImages } from "@/app/api/images/imageActions";
// import Image from "next/image";
// import Link from "next/link";
// import { useEffect, useState } from "react";

// export default function ExploreClientPage() {
//   const [images, setImages] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const data = await getPublicImages();
        
//         console.log("images in explore page", data);
        
//         // Har image ke saath user info add karo (optional)
//         const imagesWithUser = data.map(img => ({
//           ...img,
//           displayName: img.ownerId?.slice(-8) || 'User'
//         }));
        
//         setImages(imagesWithUser);
//       } catch (error) {
//         console.error("Error fetching public images:", error);
//         setImages([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Loading state
//   if (loading) {
//     return (
//       <div className="container mx-auto p-6">
//         <h1 className="text-3xl font-bold mb-8">Explore</h1>
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//           {Array(8).fill().map((_, i) => (
//             <div key={i} className="border rounded-lg p-4 animate-pulse">
//               <div className="w-full h-48 bg-gray-200 rounded mb-2"></div>
//               <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//               <div className="h-3 bg-gray-200 rounded w-1/2"></div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   // No images found
//   if (images.length === 0) {
//     return (
//       <div className="container mx-auto p-6">
//         <h1 className="text-3xl font-bold mb-8">Explore</h1>
//         <div className="text-center py-20">
//           <p className="text-2xl text-gray-500 mb-4">No public images yet</p>
//           <p className="text-gray-400">Be the first to publish your creation!</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-8">Explore ({images.length})</h1>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         {images.map((img) => (
//           <Link 
//             key={img.id} 
//             href={`/u/${img.ownerId}`}  // ✅ FIXED: Direct ownerId use kiya
//           >
//             <div className="border rounded-lg p-4 hover:shadow-lg transition-all duration-300 cursor-pointer group">
//               <div className="overflow-hidden rounded-lg mb-2">
//                 <Image
//                   src={img.url}
//                   alt={img.prompt || "Generated image"}
//                   width={400}
//                   height={400}
//                   className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
//                 />
//               </div>
//               <p className="text-sm text-gray-600 line-clamp-2 mb-2 group-hover:text-gray-900">
//                 {img.prompt}
//               </p>
//               <div className="flex items-center gap-2">
//                 {/* ✅ FIXED: Tailwind gradient syntax */}
//                 <div className="w-6 h-6 bg-linear-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
//                   <span className="text-xs font-bold text-white">
//                     {img.ownerId?.slice(-2).toUpperCase()}
//                   </span>
//                 </div>
//                 <p className="text-xs text-gray-500">
//                   @{img.displayName || img.ownerId?.slice(-8)}
//                 </p>
//               </div>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }

import Link from "next/link";
import ExploreClientPage from "./explor-client";
import Image from "next/image";
import { getPublicImages } from "@/app/api/images/imageActions";

export default async function ExplorePage() {
  const images = await getPublicImages();

  if (images.length === 0) return <div>No images found</div>;

  console.log("images in explore page", images);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Explore</h1>
      <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1" >
        {images.map((img, key) => (
          <Link href={`/u/${img.ownerId}`} key={key}>
            <Image
              width={500}
              height={500}
              src={img.url}
              alt="User image"
              className="rounded-lg"
            />
          </Link>
        ))}
      </div>

      {/* <ExploreClientPage /> */}
    </div>
  );
}

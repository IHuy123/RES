import { useEffect, useState } from "react";
import { ReactImageGalleryItem } from "react-image-gallery";
import ImageGallery from "react-image-gallery";
import React from "react";

export interface RestaurantImagesProps {
    image: string;
}
const RestaurantImage: React.FC<RestaurantImagesProps> = (props: RestaurantImagesProps) => {
    const { image } = props;
    const [img, setImg] = useState<ReactImageGalleryItem[]>([]);

    useEffect(() => {
        image
            ? setImg([
                  {
                      original: `${image}`,
                      thumbnail: `${image}`,
                  },
              ])
            : setImg([
                  {
                      original:
                          "https://st3.depositphotos.com/1767687/16607/v/450/depositphotos_166074422-stock-illustration-default-avatar-profile-icon-grey.jpg",
                      thumbnail:
                          "https://st3.depositphotos.com/1767687/16607/v/450/depositphotos_166074422-stock-illustration-default-avatar-profile-icon-grey.jpg",
                  },
              ]);
    }, [image]);

    return (
        <>
            <ImageGallery
                items={img}
                disableThumbnailScroll
                showPlayButton={false}
                showThumbnails={false}
                showFullscreenButton={false}
                lazyLoad={false}
                showNav={false}
                onErrorImageURL="https://st4.depositphotos.com/14953852/22772/v/600/depositphotos_227725020-stock-illustration-image-available-icon-flat-vector.jpg"
            />
        </>
    );
};

export default RestaurantImage;

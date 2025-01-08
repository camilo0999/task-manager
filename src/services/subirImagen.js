import { Cloudinary } from "@cloudinary/url-gen";


const subirImagen = async (imagen) => {
    const cloudName = "dobp8aw1h";
    const uploadPreset = "TaskManagerPreset"; // Reemplaza con tu upload preset de Cloudinary

    const cld = new Cloudinary({ cloud: { cloudName } });

    const file = imagen;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
                method: "POST",
                body: formData,
            }
        );
        const data = await response.json();

        console.log("DATA IMAGEN: ", data.secure_url);
        return data.secure_url;
    } catch (error) {
        console.error("Error al subir la imagen:", error);
        return "";
    }
}

export {subirImagen};
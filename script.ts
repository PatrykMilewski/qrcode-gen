import { toFile } from 'qrcode';
import { v4 } from 'uuid';
import mergeImg from 'merge-img-vwv';
import { rmSync } from 'fs'

const codesCustom = [
    'BLM_00003981', // Zam. Kuriera. A Inpost
    'BLM_00004141', // Zam. Kuriera. B Inpost
    'BLM_00004142', // Zam. Kuriera. C Inpost
    'BLM_00004158', // Gabaryt A DPD Apaczka
    'BLM_00004161', // Gabaryt B DPD Apaczka
    'BLM_00004162', // Gabaryt C DPD Apaczka
    'BLM_00004185', // Nadam w paczk. A Inpost
    'BLM_00004186', // Nadam w paczk. B Inpost
    'BLM_00004187', // Nadam w paczk. C Inpost
    'BLM_00004309', // Jutro: A: DPD Apaczka
    'BLM_00004310', // Jutro: B: DPD Apaczka
    'BLM_00004311', // Jutro: C: DPD Apaczka
    'BLM_00004235', // UPS A: WysylamAll
    'BLM_00004765', // UPS B: WysylamAll
    'BLM_00004766', // UPS C: WysylamAll
]

const codesBuiltIn = [
    "BLF_00000004", // zaznacz zamówienia
    'BLF_00000005', // odznacz zamówienia
    'BLF_00000001', // pakowanie
    'BLF_00000002', // nastepne
    'BLF_00000003', // poprzednie
]



const codes = codesBuiltIn;

export const generate = async (): Promise<void> => {
    const fileNames = [];
    for (const code of codes) {
        const fileName = `/tmp/qrcode-gen/img${v4()}.png`;
        await toFile(fileName, code, {
            errorCorrectionLevel: 'Q',
            margin: 1,
            scale: 4,
        });
        fileNames.push(fileName);
    }
    try {
        // number of images
        for (let finalImages = 0; finalImages < Math.ceil(fileNames.length / 15); finalImages += 1) {
            // 4 rows
            const theWholeImage = [];
            for (let i = 0; i < 5 && fileNames.length > 0; i += 1) {
                // 2 images in a row
                const rowImages: string[] = [];
                for (let j = 0; j < 3 && fileNames.length > 0; j += 1) {
                    rowImages.push(fileNames.pop());
                }
                const rowImage = await mergeImg(rowImages, { direction: false });
                const rowImageName = `/tmp/qrcode-gen/rowImage${v4()}.png`;
                theWholeImage.push(rowImageName);
                await rowImage.writeAsync(rowImageName);
                removeImages(rowImages);
            }
            const theWholeImageJoined = await mergeImg(theWholeImage, { direction: true });
            const theWholeImageJoinedName = `theWholeImageJoined-${new Date().toISOString}.png`;
            await theWholeImageJoined.writeAsync(theWholeImageJoinedName);
            removeImages(theWholeImage);
        }
        removeImages(fileNames);
    } catch (err) {
        throw err;
    }
}

const removeImages = (paths: string[]): void => {
    paths.forEach(path => rmSync(path, { force: true }));
}
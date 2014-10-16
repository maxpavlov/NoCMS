namespace noCMS.demo.Areas.Admin.FileHandler
{
    public class GalleryFileStatus : FilesStatus
    {
        public string ImageId { get; set; }
        public string GalleryId { get; set; }

        public GalleryFileStatus(string fileName, int fileLength, string fullPath, bool webPath, string imageId, string galleryId)
        {
            SetValues(fileName, fileLength, fullPath, webPath);
            ImageId = imageId;
            GalleryId = galleryId;
        }
    }
}
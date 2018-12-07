using Microsoft.AspNetCore.Http;
using SETPPBO.Models;
using System;
using System.IO;
using System.Net;
using System.Net.Mail;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace SETPPBO.Utility
{
    public class Util
    {
        private static readonly string firstSalt = "S3+P3ng4d1!4nP4]4<";
        //~ for enc/decrypt 
        private static readonly string hashKey = "&cryp+10nC0d3";
        private static readonly string saltKey = "S3+P3ng4d1!4nP4]4<";
        private static readonly string vKey = "F1n|nf0Sy$&T3ch_"; //~ initial vector size: should be 16 bytes

        public static string SHAHash(string text, string lastSalt = "")
        {
            //~ add first salt
            text = firstSalt + text + lastSalt;

            SHA512 sha = new SHA512CryptoServiceProvider();

            //compute hash from the bytes of text
            sha.ComputeHash(Encoding.ASCII.GetBytes(text));

            //get hash result after compute it
            byte[] result = sha.Hash;

            StringBuilder strBuilder = new StringBuilder();
            for (int i = 0; i < result.Length; i++)
            {
                //change it into 2 hexadecimal digits for each byte
                strBuilder.Append(result[i].ToString("x2"));
            }

            return strBuilder.ToString();
        }

        public static string MD5Hash(string text, string lastSalt = "")
        {
            //~ add first salt
            text = firstSalt + text + lastSalt;

            MD5 md5 = MD5.Create();

            //compute hash from the bytes of text
            md5.ComputeHash(Encoding.ASCII.GetBytes(text));

            //get hash result after compute it
            byte[] result = md5.Hash;

            StringBuilder strBuilder = new StringBuilder();
            for (int i = 0; i < result.Length; i++)
            {
                //change it into 2 hexadecimal digits for each byte
                strBuilder.Append(result[i].ToString("x2"));
            }

            return strBuilder.ToString();
        }

        //~ return only numbers
        //~ implementation on, e.g. NPWP
        public static string GetNumbers(string text)
        {
            return Regex.Replace(text, "[^0-9]", "");
        }

        //~ send email notification
        public static bool SendNotification(ConfigSmtp conf, string msgTo, string msgSubject, string msgBody)
        {
            try
            {
                //~ smtp setting
                var SENDER_ADDRESS = conf.SenderAddress;
                var SENDER_NAME = conf.SenderName;
                var SENDER_SECRET = Decrypt(conf.SenderSecret); //~ decrypted
                var SENDER_SERVER = conf.SenderServer;
                var SENDER_DOMAIN = conf.SenderDomain;

                //~ generate message
                MailMessage mailMessage = new MailMessage();

                mailMessage.From = new MailAddress(SENDER_ADDRESS);
                mailMessage.To.Add(msgTo);
                mailMessage.Subject = msgSubject;
                mailMessage.Body = msgBody;
                mailMessage.IsBodyHtml = true;

                //~ smtp setting
                SmtpClient client = new SmtpClient(SENDER_SERVER);
                //client.UseDefaultCredentials = false;
                client.Credentials = new NetworkCredential(SENDER_NAME, SENDER_SECRET, SENDER_DOMAIN);

                try
                {
                    client.Send(mailMessage);
                    return true;
                }
                catch (Exception)
                {
                    return false;
                }
            }
            catch (Exception)
            {
                return false;
            }
        }

        public static string Encrypt(string plainText)
        {
            byte[] plainTextBytes = Encoding.UTF8.GetBytes(plainText);

            byte[] keyBytes = new Rfc2898DeriveBytes(hashKey, Encoding.ASCII.GetBytes(saltKey)).GetBytes(256 / 8);
            var symmetricKey = new RijndaelManaged() { Mode = CipherMode.CBC, Padding = PaddingMode.Zeros };
            var encryptor = symmetricKey.CreateEncryptor(keyBytes, Encoding.ASCII.GetBytes(vKey));

            byte[] cipherTextBytes;

            using (var memoryStream = new MemoryStream())
            {
                using (var cryptoStream = new CryptoStream(memoryStream, encryptor, CryptoStreamMode.Write))
                {
                    cryptoStream.Write(plainTextBytes, 0, plainTextBytes.Length);
                    cryptoStream.FlushFinalBlock();
                    cipherTextBytes = memoryStream.ToArray();
                    cryptoStream.Close();
                }
                memoryStream.Close();
            }
            return Base64UrlEncode(Convert.ToBase64String(cipherTextBytes)); //~ add Base64UrlEncode
        }

        public static string Decrypt(string encryptedText)
        {
            encryptedText = Base64UrlDecode(encryptedText); //~

            byte[] cipherTextBytes = Convert.FromBase64String(encryptedText);
            byte[] keyBytes = new Rfc2898DeriveBytes(hashKey, Encoding.ASCII.GetBytes(saltKey)).GetBytes(256 / 8);
            var symmetricKey = new RijndaelManaged() { Mode = CipherMode.CBC, Padding = PaddingMode.None };

            var decryptor = symmetricKey.CreateDecryptor(keyBytes, Encoding.ASCII.GetBytes(vKey));
            var memoryStream = new MemoryStream(cipherTextBytes);
            var cryptoStream = new CryptoStream(memoryStream, decryptor, CryptoStreamMode.Read);
            byte[] plainTextBytes = new byte[cipherTextBytes.Length];

            int decryptedByteCount = cryptoStream.Read(plainTextBytes, 0, plainTextBytes.Length);
            memoryStream.Close();
            cryptoStream.Close();
            return Encoding.UTF8.GetString(plainTextBytes, 0, decryptedByteCount).TrimEnd("\0".ToCharArray());
        }

        public async static Task<string> UploadFile(
            IFormFile File,
            string Dir = "wwwroot/default_upload/",
            long MaxSizeInMB = 0,
            string Ext = null
        )
        {
            if (File != null)
            {
                long MaxSize = MaxSizeInMB * 1000000;
                long FileLength = File.Length;
                string FileExt = Path.GetExtension(File.FileName);
                string FileName = System.Guid.NewGuid().ToString("N") + FileExt;
                var CurDir = Path.Combine(Directory.GetCurrentDirectory(), Dir);
                var FileDir = Path.Combine(Directory.GetCurrentDirectory(), Dir, FileName);

                if (
                    (FileLength > 0 && FileLength < MaxSize) &&
                    Ext.Contains(FileExt)
                )
                {
                    if (!(Directory.Exists(CurDir)))
                    {
                        Directory.CreateDirectory(CurDir);
                    }

                    using (var stream = new FileStream(FileDir, FileMode.Create))
                    {
                        await File.CopyToAsync(stream);
                    }
                    return FileName;
                }
            }
            return null;
        }


        //public static string EncryptString(string words, string key = "&cryp+10nC0d3")
        //{
        //    byte[] Results;
        //    UTF8Encoding UTF8 = new UTF8Encoding();

        //    // Step 1. We hash the passphrase using MD5
        //    // We use the MD5 hash generator as the result is a 128 bit byte array
        //    // which is a valid length for the TripleDES encoder we use below

        //    MD5CryptoServiceProvider HashProvider = new MD5CryptoServiceProvider();
        //    byte[] TDESKey = HashProvider.ComputeHash(UTF8.GetBytes(key));

        //    // Step 2. Create a new TripleDESCryptoServiceProvider object
        //    TripleDESCryptoServiceProvider TDESAlgorithm = new TripleDESCryptoServiceProvider();

        //    // Step 3. Setup the encoder
        //    TDESAlgorithm.Key = TDESKey;
        //    TDESAlgorithm.Mode = CipherMode.ECB;
        //    TDESAlgorithm.Padding = PaddingMode.PKCS7;

        //    // Step 4. Convert the input string to a byte[]
        //    byte[] DataToEncrypt = UTF8.GetBytes(words);

        //    // Step 5. Attempt to encrypt the string
        //    try
        //    {
        //        ICryptoTransform Encryptor = TDESAlgorithm.CreateEncryptor();
        //        Results = Encryptor.TransformFinalBlock(DataToEncrypt, 0, DataToEncrypt.Length);
        //    }
        //    finally
        //    {
        //        // Clear the TripleDes and Hashprovider services of any sensitive information
        //        TDESAlgorithm.Clear();
        //        HashProvider.Clear();
        //    }

        //    // Step 6. Return the encrypted string as a base64 encoded string
        //    return Convert.ToBase64String(Results);
        //}

        //public static string DecryptString(string words, string key = "&cryp+10nC0d3")
        //{
        //    byte[] Results;
        //    UTF8Encoding UTF8 = new UTF8Encoding();

        //    // Step 1. We hash the passphrase using MD5
        //    // We use the MD5 hash generator as the result is a 128 bit byte array
        //    // which is a valid length for the TripleDES encoder we use below

        //    MD5CryptoServiceProvider HashProvider = new MD5CryptoServiceProvider();
        //    byte[] TDESKey = HashProvider.ComputeHash(UTF8.GetBytes(key));

        //    // Step 2. Create a new TripleDESCryptoServiceProvider object
        //    TripleDESCryptoServiceProvider TDESAlgorithm = new TripleDESCryptoServiceProvider();

        //    // Step 3. Setup the decoder
        //    TDESAlgorithm.Key = TDESKey;
        //    TDESAlgorithm.Mode = CipherMode.ECB;
        //    TDESAlgorithm.Padding = PaddingMode.PKCS7;

        //    // Step 4. Convert the input string to a byte[]
        //    byte[] DataToDecrypt = Convert.FromBase64String(words);

        //    // Step 5. Attempt to decrypt the string
        //    try
        //    {
        //        ICryptoTransform Decryptor = TDESAlgorithm.CreateDecryptor();
        //        Results = Decryptor.TransformFinalBlock(DataToDecrypt, 0, DataToDecrypt.Length);
        //    }
        //    finally
        //    {
        //        // Clear the TripleDes and Hashprovider services of any sensitive information
        //        TDESAlgorithm.Clear();
        //        HashProvider.Clear();
        //    }

        //    // Step 6. Return the decrypted string in UTF8 format
        //    return UTF8.GetString(Results);
        //}

        //~ encode base64 string to url safe string
        //~ string64 is an Base64 string
        private static string Base64UrlEncode(string string64)
        {
            string s = string64;
            s = s.Split('=')[0]; // Remove any trailing '='s
            s = s.Replace('+', '-'); // 62nd char of encoding
            s = s.Replace('/', '_'); // 63rd char of encoding
            return s;
        }

        //~ decode encoded url safe string to legal base64 string 
        //~ string64 is a Base64 string
        private static string Base64UrlDecode(string string64)
        {
            string s = string64;
            s = s.Replace('-', '+'); // 62nd char of encoding
            s = s.Replace('_', '/'); // 63rd char of encoding
            switch (s.Length % 4) // Pad with trailing '='s
            {
                case 0: break; // No pad chars in this case
                case 2: s += "=="; break; // Two pad chars
                case 3: s += "="; break; // One pad char
                default:
                    throw new Exception(
             "Illegal base64url string!");
            }
            return s;
        }

        public static string GetFormatNomorSengketa(string nomorSengketa)
        {
            string format = nomorSengketa.Substring(0, 6) + "." +
                                       nomorSengketa.Substring(6, 2) + "/" +
                                        nomorSengketa.Substring(8, 4) + "/PP";
            return format;
        }

    }
}
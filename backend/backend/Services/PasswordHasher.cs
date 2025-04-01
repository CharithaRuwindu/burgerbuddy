using System;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using backend.Models.Entities;

namespace backend.Services
{
    public interface IPasswordService
    {
        string HashPassword(string password);
        bool VerifyPassword(string password, string hashedPassword);
        void SetPasswordForUser(User user, string plainTextPassword);
    }

    public class PasswordService : IPasswordService
    {
        public string HashPassword(string password)
        {
            byte[] salt = new byte[16];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }

            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 100000,
                numBytesRequested: 32));

            return $"PBKDF2$100000${Convert.ToBase64String(salt)}${hashed}";
        }

        public bool VerifyPassword(string password, string hashedPassword)
        {
            var parts = hashedPassword.Split('$');
            if (parts.Length != 4)
            {
                throw new FormatException("Unexpected hash format");
            }

            var algorithm = parts[0];
            var iterations = int.Parse(parts[1]);
            var salt = Convert.FromBase64String(parts[2]);
            var hash = parts[3];

            if (algorithm != "PBKDF2" || iterations != 100000)
            {
                throw new FormatException("Unexpected hash format or algorithm");
            }

            string computedHash = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: iterations,
                numBytesRequested: 32));

            return computedHash == hash;
        }

        public void SetPasswordForUser(User user, string plainTextPassword)
        {
            user.Hashedpassword = HashPassword(plainTextPassword);

            user.PlainTextPassword = null;

            user.UpdatedAt = DateTime.UtcNow;
        }
    }
}
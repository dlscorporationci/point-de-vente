<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class RealEmailRule implements ValidationRule
{
    /**
     * Liste noire des domaines d'e-mails jetables, temporaires et fictifs de test
     */
    protected array $disposableDomains = [
        'mailinator.com',
        'yopmail.com',
        'yopmail.fr',
        'tempmail.com',
        'temp-mail.org',
        'guerrillamail.com',
        '10minutemail.com',
        'trashmail.com',
        'dispostable.com',
        'getnada.com',
        'sharklasers.com',
        'maildrop.cc',
        'fakeinbox.com',
        'crazymailing.com',
        'example.com',
        'example.org',
        'example.net',
        'test.com',
        'test.fr',
        'domain.com',
        'sample.com',
        'invalid.com',
        'foo.com',
        'bar.com',
        'localhost',
    ];

    /**
     * Run the validation rule.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (empty($value) || !is_string($value)) {
            $fail("L'adresse e-mail est obligatoire.");
            return;
        }

        $email = strtolower(trim($value));

        // 1. Validation de la syntaxe RFC 5322
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $fail("L'adresse e-mail n'a pas un format valide (ex: utilisateur@domaine.com).");
            return;
        }

        // 2. Extraire le nom d'utilisateur et le domaine
        $parts = explode('@', $email);
        if (count($parts) !== 2) {
            $fail("L'adresse e-mail fournie est invalide.");
            return;
        }
        $username = $parts[0];
        $domain   = $parts[1];

        // 3. Vérification des domaines jetables / de test fictif
        if (in_array($domain, $this->disposableDomains)) {
            $fail("Les adresses e-mails temporaires, de démonstration ou fictives (@{$domain}) ne sont pas autorisées.");
            return;
        }

        // 4. Détection des motifs de noms d'utilisateurs manifestement fictifs (ex: test@, fake@, asdf@, 0000@, etc.)
        $bogusPatterns = [
            '/^(test|demo|fake|dummy|asdf|qwerty|zxcv|1234|0000|aaaa|bbbb|cccc)[0-9]*$/i',
            '/^contact[0-9]{3,}$/i'
        ];
        foreach ($bogusPatterns as $pattern) {
            if (preg_match($pattern, $username)) {
                $fail("Les adresses e-mails de test ou génériques ({$username}@...) ne sont pas autorisées. Veuillez utiliser votre adresse e-mail professionnelle réelle.");
                return;
            }
        }

        // 5. Validation instantanée en mémoire (0ms, aucun appel réseau DNS bloquant)
        return;
    }
}

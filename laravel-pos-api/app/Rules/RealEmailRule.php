<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class RealEmailRule implements ValidationRule
{
    /**
     * Liste noire des domaines d'e-mails jetables/temporaires
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

        // 2. Extraire le domaine
        $parts = explode('@', $email);
        if (count($parts) !== 2) {
            $fail("L'adresse e-mail fournie est invalide.");
            return;
        }
        $domain = $parts[1];

        // 3. Vérification des domaines jetables / de test fictif
        if (in_array($domain, $this->disposableDomains)) {
            $fail("Les adresses e-mails temporaires ou jetables (@{$domain}) ne sont pas autorisées.");
            return;
        }

        // 4. Vérification de l'existence réelle du domaine via les enregistrements DNS MX ou A
        // if MX check returns false and A record check returns false, domain cannot receive emails
        $hasMx = @checkdnsrr($domain, 'MX');
        $hasA  = @checkdnsrr($domain, 'A');

        if (!$hasMx && !$hasA) {
            $fail("L'adresse e-mail n'existe pas ou son domaine (@{$domain}) n'est pas actif.");
        }
    }
}

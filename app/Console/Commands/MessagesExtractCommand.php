<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\File;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Console\ConfirmableTrait;
use Illuminate\Contracts\Filesystem\FileNotFoundException;

class MessagesExtractCommand extends Command
{
    use ConfirmableTrait;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'messages:extract {--sort}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Extract application translation messages';

    /**
     * Execute the console command.
     *
     * @return int
     * @throws \JsonException
     * @throws FileNotFoundException
     */
    public function handle(): int
    {
        $messages = [];
        $language = config('app.locale');
        $filePath = lang_path("$language.json");
        $jsonOptions = JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES;
        $directories = [app_path(), config_path(), database_path(), resource_path(), base_path('routes')];

        if (File::exists($filePath)) {
            $messages = json_decode(File::get($filePath), true, 512, JSON_THROW_ON_ERROR) ?? [];
        }

        $sort = (bool)$this->option('sort');

        $this->comment('Extracting messages...');

        foreach ($directories as $directory) {
            foreach ((new Filesystem())->allFiles($directory) as $file) {
                if (($fp = @fopen($file, 'rb'))) {
                    while (feof($fp) === false) {
                        $matchingPattern = "[\W](?<!->)(__)\([\'\"](.+)[\'\"][\),]";
                        if (preg_match_all("/$matchingPattern/siU", fgets($fp), $matches)) {
                            foreach ($matches[2] as $message) {
                                if ($this->messageExists($message, $messages) === false) {
                                    $messages[$message] = $message;
                                }
                            }
                        }
                    }
                }

                fclose($fp);
            }
        }

        if (!empty($messages)) {
            if ($sort === true) {
                ksort($messages);
            }

            File::put($filePath, Collection::make($messages)->toJson($jsonOptions));
        }

        $this->comment('Done.');

        return 0;
    }

    private function messageExists($message, $messages): bool
    {
        foreach ($messages as $key => $value) {
            if (strcmp($key, $message) === 0) {
                return true;
            }
        }

        return false;
    }
}

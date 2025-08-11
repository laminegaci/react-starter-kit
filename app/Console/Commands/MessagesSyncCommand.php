<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\File;
use Illuminate\Console\ConfirmableTrait;
use Illuminate\Contracts\Filesystem\FileNotFoundException;

class MessagesSyncCommand extends Command
{
    use ConfirmableTrait;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'messages:sync {--files=} {--source=} {--sort}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Synchronize application translation messages';

    /**
     * Execute the console command.
     *
     * @return int
     * @throws \JsonException
     */
    public function handle(): int
    {
        $files =  $this->option('files');
        $sort = (bool)$this->option('sort');
        $source =  $this->option('source') ?? app()->getLocale();
        $sourceFilePath = lang_path("{$source}.json");
        $jsonOptions = JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES;

        if (!File::exists($sourceFilePath)) {
            $this->comment('No source file found.');
            return 0;
        }

        if ($files === null) {
            $this->comment('Please provide files to sync.');
            return 0;
        }

        $files = explode(',', $files);
        $sourceContent = json_decode(File::get($sourceFilePath), true, 512, JSON_THROW_ON_ERROR);

        foreach ($files as $file) {
            $filePath = lang_path("$file.json");

            if (File::exists($filePath)) {
                $content = json_decode(File::get($filePath), true, 512, JSON_THROW_ON_ERROR);

                foreach ($sourceContent as $key => $translation) {
                    if (!$this->messageExists($translation, $content)) {
                        $content[$key] = $translation;
                    }
                }

                if ($sort === true) {
                    ksort($messages);
                }

                File::put($filePath, Collection::make($content)->toJson($jsonOptions));
            } else {
                $this->comment("The file `{$filePath}` does not exists.");
            }
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

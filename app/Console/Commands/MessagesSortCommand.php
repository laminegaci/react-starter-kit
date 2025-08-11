<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\File;
use Illuminate\Console\ConfirmableTrait;
use Illuminate\Contracts\Filesystem\FileNotFoundException;

class MessagesSortCommand extends Command
{
    use ConfirmableTrait;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'messages:sort {--files=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sort application translation messages';

    /**
     * Execute the console command.
     *
     * @return int
     * @throws \JsonException
     */
    public function handle(): int
    {
        $files =  $this->option('files');
        $jsonOptions = JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES;

        if ($files === null) {
            $this->comment('Please provide files to sort.');
            return 0;
        }

        $files = explode(',', $files);

        foreach ($files as $file) {
            $filePath = lang_path("$file.json");

            if (File::exists($filePath)) {
                $content = json_decode(File::get($filePath), true, 512, JSON_THROW_ON_ERROR);

                if ($content) {
                    ksort($content);
                    File::put($filePath, Collection::make($content)->toJson($jsonOptions));
                } else {
                    $this->comment("`$filePath` is invalid.");
                }
            } else {
                $this->comment("The file `$filePath` does not exists.");
            }
        }

        $this->comment('Done.');

        return 0;
    }
}

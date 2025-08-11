<?php

namespace App\Console\Commands;

use App\Enums\ZoneEnum;
use Illuminate\Console\Command;
use Illuminate\Console\ConfirmableTrait;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;

class ResetAppCommand extends Command
{
    use ConfirmableTrait;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:reset {--key-generate} {--zone=turkey}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reset and initialize application.';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }


    public function handle(): int
    {
        $shouldConfirm = config('app.env') === 'production';
        $keyGenerate = $this->option('key-generate');

        if ($shouldConfirm) {
            $this->alert('You\'re in production !');

            if (!$this->confirm('This action will erase all your current data, continue?')) {
                $this->comment('You are not brave, come back later...');

                return 0;
            }
        }
        if ($shouldConfirm || $keyGenerate) {
            $this->comment('Generating application encryption key...');
            Artisan::call('key:generate', ['--force' => true]);
        }
        $this->comment('Resetting migrations...');
        Artisan::call('migrate:fresh', ['--force' => true]);

        //delete medias for active region
        if (Storage::exists('public/media/user')) {
            $this->comment('Deleting folders...');
            Storage::deleteDirectory('public/media/user');
        }

        $this->comment('Seeding database...');
        Artisan::call('db:seed', ['--force' => true]);

        $this->comment('Deleting application cache...');

        $this->comment('Done.');

        return 0;
    }
}
